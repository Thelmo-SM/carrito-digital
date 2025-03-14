'use client';

import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import { useCreateItems } from "../hooks/useCreateItems";
import { productsTypes } from "@/types/productTypes";
import Style from '@/styles/producForm.module.css'


const initialProductsValues: productsTypes = {
       // image: '',
        name: '',
        price: 0,
        soldUnits: 0,
        description: ''
}

type CreateProductProps = {
    getProduct: () => Promise<void>;
  };


export const CreateProduct = ({getProduct}: CreateProductProps) => {
      const user = useAuthUsers();
    const {
        form,
        handleChange,
        handleSubmit
    } = useCreateItems(initialProductsValues, user?.uid, getProduct)

    return (
        <div className={Style.container}>
            <form onSubmit={(e) => handleSubmit(e, form)}
                className={Style.formContainer}
                >
                <h2>Crear productos</h2>
                <div>
                <label htmlFor="file_id">Imagen</label>
                <input 
                className={Style.image}
                type="file"
                id="file_id"
                onChange={handleChange}
                />
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
                <label htmlFor="soldUnits_id">Candidad</label>
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
                >

                </textarea>
                </div>
                <button>Crear</button>
            </form>
        </div>
    );
};

export default CreateProduct;