import { useState } from "react";
import { addDocument } from "@/utils/firebase";
import { productsTypes } from "@/types/productTypes";

export const useCreateItems = (
  initialValue: productsTypes,
  userUid: string,
  getItems: () => Promise<void>
) => {
  const [form, setForm] = useState(initialValue);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const itemCollection = async (items: productsTypes) => {
    if (!userUid) {
      console.log("No hay usuario autenticado");
      return;
    }

    const path = `users/${userUid}/products`;

    try {
      await addDocument(path, items);
      console.log("Producto agregado correctamente");
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent, items: productsTypes) => {
    e.preventDefault();

    if (!file) {
      console.log("No se ha seleccionado ninguna imagen");
      return;
    }

    try {
      console.log(file); // Verifica si el archivo está correctamente adjunto
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
    });
    
    const data = await response.json();
    console.log("Respuesta de Cloudinary:", data); // Verifica la respuesta completa
    
    if (!response.ok || !data.secure_url) {
        console.error("Error al subir la imagen a Cloudinary:", data.message || "URL no disponible");
        return;
    }
      // Guardar solo la URL de la imagen en Firestore
      const newItem = { ...items, imageUrl: data.secure_url };
      await itemCollection(newItem);

      console.log("Producto guardado con imagen en Firestore");
      getItems();
    } catch (error) {
      console.error("Error en el proceso de subida:", error);
    }
  };

  return {
    form,
    handleChange,
    handleSubmit,
    handleFileChange,
  };
};
