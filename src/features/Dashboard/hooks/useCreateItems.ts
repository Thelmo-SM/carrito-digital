import { useState } from "react";
import { addDocument } from "../services/addDocumentServices"; 
import { productsTypes } from "@/types/productTypes";

export const useCreateItems = (
  initialValue: productsTypes,
  getItems: () => Promise<void>,
  closeModal: () => void
) => {
  const [form, setForm] = useState(initialValue);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };


  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    
    // Agregar las nuevas categorías seleccionadas sin reemplazar las anteriores
    setForm(prevForm => {
      // Fusionamos las categorías previas con las nuevas seleccionadas
      const updatedCategories = Array.from(new Set([...prevForm.categorie, ...selectedOptions])); // Usamos Set para evitar duplicados
      return {
        ...prevForm,
        categorie: updatedCategories
      };
    });
  
    console.log("Categorias seleccionadas:", selectedOptions);
  };
  const handleCategoryRemove = (category: string) => {
    setForm(prevForm => ({
      ...prevForm,
      categorie: prevForm.categorie.filter(cat => cat !== category)
    }));
    console.log("Categoría eliminada:", category);
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
    setLoading(true);
  
    if (!file) {
      console.log("No se ha seleccionado ninguna imagen");
      setLoading(false);
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
      setForm(initialValue); // Resetea los valores del formulario a los valores iniciales
      setFile(null); // Limpia el archivo de imagen
      setImagePreview(null); // Limpia la vista previa de la imagen
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
