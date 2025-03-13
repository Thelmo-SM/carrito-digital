'use client';

import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import { useCreateItems } from "../hooks/useCreateItems";
import { productsTypes } from "@/types/productTypes";


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
        <div>
            <form style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }} onSubmit={(e) => handleSubmit(e, form)}>
                <h1>Nombre: {user?.name}</h1>
                <h2>Crear productos</h2>
                {/* <div>
                <label>Imagen</label>
                <input 
                type="text"
                id="name_id"
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                </div> */}
                <div>
                <label htmlFor="name_id">Nombre del producto</label>
                <input 
                type="text"
                id="name_id" 
                name="name"
                value={form.name}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' }}
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
                style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' }}
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
                style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                </div>
                <div>
                <label htmlFor="description_id">Descripción</label>
                <input 
                type="text" 
                name="description" 
                id="description_id"
                value={form.description}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                </div>
                <button>Crear</button>
            </form>
        </div>
    );
};

export default CreateProduct;