'use client';

import { useState } from 'react';
import Style from '@/styles/producForm.module.css';
import { productsTypes } from '@/types/productTypes';
import { updateDocument } from '../services/addDocumentServices';
import Image from 'next/image';

interface UpdateProductsProps {
  product: productsTypes;
  getProduct: () => Promise<void>;
}

export const UpdateProducts = ({ getProduct, product }: UpdateProductsProps) => {
  const [form, setForm] = useState<productsTypes>(product);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile)
  
      // Crear una URL temporal para la vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = form.imageUrl;

    if (file) {
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!uploadPreset) {
          console.error("El upload preset no está definido en las variables de entorno");
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

        if (response.ok) {
          imageUrl = data.secure_url;
        } else {
          console.error('Error al subir la imagen:', data.message);
          return;
        }
      } catch (error) {
        console.error('Error al subir la imagen:', error);
        return;
      }
    }

    // Actualizar el producto en Firebase
    try {
      await updateDocument(`products/${product.id}`, { ...form, imageUrl });
      console.log('Producto actualizado correctamente');
      getProduct(); // Recargar productos
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
    }
  };

  return (
    <div className={Style.container}>
      <form className={Style.formContainer} onSubmit={handleSubmit}>
        <h2>Editar Producto</h2>

        <div>
          <label htmlFor="file_id">Imagen</label>
          <input type="file" id="file_id" onChange={handleFileChange} />
          {imagePreview && (
            <Image src={imagePreview} width={100} height={100} alt="Vista previa" className={Style.imagePreview} />
          )}
        </div>

        <div>
          <label htmlFor="name_id">Nombre del producto</label>
          <input type="text" id="name_id" name="name" value={form.name} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="price_id">Precio</label>
          <input type="number" name="price" id="price_id" value={form.price} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="soldUnits_id">Cantidad</label>
          <input type="number" name="soldUnits" id="soldUnits_id" value={form.soldUnits} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="description_id">Descripción</label>
          <textarea name="description" id="description_id" value={form.description} onChange={handleChange} className={Style.textarea}></textarea>
        </div>

        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default UpdateProducts;
