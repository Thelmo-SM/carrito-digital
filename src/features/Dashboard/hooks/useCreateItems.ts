import { useState } from "react";
import { addDocument } from "@/utils/firebase";
import { productsTypes } from "@/types/productTypes";

export const useCreateItems = (initialValue: productsTypes, userUid: string, getItems: () => Promise<void>) => {
  const [form, setForm] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((capture) => ({
      ...capture,
      [name]: value,
    }));
    console.log('Datos del formulario:', value);
  };

  const itemCollection = async (items: productsTypes) => {
    if (!userUid) {
      console.log('No hay usuario autenticado');
      return; // Retorna si no hay un usuario autenticado
    }

    const path = `users/${userUid}/products`;

    try {
      await addDocument(path, items);
      console.log('Producto agregado correctamente');
    } catch (error: unknown) {
      console.log('Error al agregar el producto: ', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent, items: productsTypes) => {
    e.preventDefault();
  
    console.log('Formulario antes de enviar:', items);
  
    // Verificar que todos los campos estén completos
    let key: string
    for (key in items) {
      if (items[key as keyof productsTypes] === "" || items[key as keyof productsTypes] === undefined || items[key as keyof productsTypes] === null) {
        console.log(`El campo ${key} no puede estar vacío.`);
        return;
      }
    }
  
    try {
      await itemCollection(items);
      getItems()
      console.log('Producto creado:', items);
    } catch (error) {
      console.log('Error al crear el producto:', error);
    }
  };

  return {
    form,
    handleChange,
    handleSubmit
  };
};
