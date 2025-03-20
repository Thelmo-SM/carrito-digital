import { useState } from "react";
import { addDocument } from "@/utils/firebase";
import { productsTypes } from "@/types/productTypes";

export const useCreateItems = (
  initialValue: productsTypes,
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      categorie: value.split(",").map((cat) => cat.trim()),
    }));
  };

  // Cambiar la ruta para guardar en la colección global 'products'
  const itemCollection = async (items: productsTypes) => {
    try {
      await addDocument("products", items); // Guarda el producto en la colección pública 'products'
      console.log("Producto agregado correctamente en la colección 'products'");
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
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
    
      const data = await response.json();
      setForm(initialValue);
      console.log("Respuesta de Cloudinary:", data);
    
      if (!response.ok || !data.secure_url) {
        console.error("Error al subir la imagen a Cloudinary:", data.message || "URL no disponible");
        return;
      }

      // Guardar el producto con la URL de la imagen en la colección pública
      const newItem = { ...items, imageUrl: data.secure_url };
      await itemCollection(newItem);

      console.log("Producto guardado con imagen en 'products'");
      getItems(); // Recargar productos
    } catch (error) {
      console.error("Error en el proceso de subida:", error);
    }
  };

  return {
    form,
    handleChange,
    handleSubmit,
    handleFileChange,
    handleCategoryChange
  };
};
