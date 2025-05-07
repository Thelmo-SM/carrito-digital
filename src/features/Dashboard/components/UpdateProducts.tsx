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
  const [files, setFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Maneja la selección de múltiples imágenes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles(newFiles);


      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    }
  };


  const uploadImages = async () => {
    const imageUrls: string[] = [];

    for (const file of files) {
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!uploadPreset) {
        console.error('El upload preset no está definido en las variables de entorno');
        return [];
      }

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          imageUrls.push(data.secure_url);
        } else {
          console.error('Error al subir la imagen:', data.message);
        }
      } catch (error) {
        console.error('Error al subir la imagen:', error);
      }
    }

    return imageUrls;
  };

  // Enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!form.id) {
      console.error('El ID del producto es inválido o no está disponible');
      return;
    }
  
    const imageUrls = await uploadImages();
  
    if (imageUrls.length === 0) {
      console.error('No se pudieron subir las imágenes');
      return;
    }
  
    console.log('Producto a actualizar con ID:', form.id);
  
    try {
      await updateDocument(form.id, { ...form, file: imageUrls.map(url => ({ path: url, url })) });
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
          <label htmlFor="file_id">Selecciona las imágenes (máximo 2)</label>
          <input
            type="file"
            id="file_id"
            onChange={handleFileChange}
            multiple
            accept="image/*"
          />
          {imagePreviews.length > 0 && imagePreviews.map((url, idx) => (
            <div key={idx} className={Style.imagePreviewContainer}>
              <Image src={url} width={100} height={100} alt={`Vista previa ${idx}`} className={Style.imagePreview} />
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="name_id">Nombre del producto</label>
          <input
            type="text"
            id="name_id"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="price_id">Precio</label>
          <input
            type="number"
            name="price"
            id="price_id"
            value={form.price}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="soldUnits_id">Cantidad</label>
          <input
            type="number"
            name="soldUnits"
            id="soldUnits_id"
            value={form.soldUnits}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="description_id">Descripción</label>
          <textarea
            name="description"
            id="description_id"
            value={form.description}
            onChange={handleChange}
            className={Style.textarea}
          ></textarea>
        </div>

        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default UpdateProducts;
