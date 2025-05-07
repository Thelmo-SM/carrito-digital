import { useState } from "react";
import { addDocument } from "../services/addDocumentServices";
import { itemImage, productsTypes } from "@/types/productTypes";

export const useCreateItems = (
  initialValue: productsTypes,
  getItems: () => Promise<void>,
  closeModal: () => void
) => {
  const [form, setForm] = useState(initialValue);
  const [file, setFile] = useState<itemImage[]>([]);  
  const [imagePreview, setImagePreview] = useState<string[]>([]); 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newImages = Array.from(selectedFiles).map(file => ({
        path: file.name,
        url: URL.createObjectURL(file),  
      }));
      setFile(prevFiles => [...prevFiles, ...newImages]);  
      setImagePreview(prevPreviews => [...prevPreviews, ...newImages.map(image => image.url)]);  
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    
    setForm(prevForm => {
      const updatedCategories = Array.from(new Set([...prevForm.categorie, ...selectedOptions]));
      return { ...prevForm, categorie: updatedCategories };
    });
  };

  const handleCategoryRemove = (category: string) => {
    setForm(prevForm => ({
      ...prevForm,
      categorie: prevForm.categorie.filter(cat => cat !== category)
    }));
  };

  const itemCollection = async (items: productsTypes) => {
    try {
      await addDocument("products", items);
      console.log("Producto agregado correctamente en la colección 'products'");
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent, items: productsTypes) => {
    e.preventDefault();
    setLoading(true);
  
    if (file.length === 0) {
      console.log("No se ha seleccionado ninguna imagen");
      setLoading(false);
      return;
    }
  
    try {
      const formData = new FormData();
      file.forEach((image, index) => {
        formData.append(`image_${index}`, image.path);  
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      setForm(initialValue);
      setFile([]);
      setImagePreview([]);
      console.log("Respuesta de Cloudinary:", data);
  
      if (!response.ok || !data.secure_url) {
        console.error("Error al subir la imagen a Cloudinary:", data.message || "URL no disponible");
        return;
      }
  
      const newItem = { ...items, file: file };  
      await itemCollection(newItem);
  
      console.log("Producto guardado con imágenes en 'products'");
      getItems();
      closeModal();
      setSuccess(true);
    } catch (error) {
      console.error("Error en el proceso de subida:", error);
    } finally {
      setLoading(false);
      setSuccess(false);
    }
  };

  return {
    form,
    imagePreview,
    loading,
    success,
    handleChange,
    handleSubmit,
    handleFileChange,
    handleCategoryChange,
    handleCategoryRemove
  };
};
