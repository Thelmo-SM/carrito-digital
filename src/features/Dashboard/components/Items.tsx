'use client';

import CreateProduct from "./CreateProduct";
import { deleteDocument, getCollection } from "@/utils/firebase";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import { useEffect, useState } from "react";
import { productsTypes } from "@/types/productTypes";
import ProductsComponent from "@/components/ProductsComponents/ProductsComponents";


export const Items = () => {

    const [itemData, setItemData] = useState<productsTypes[]>([])
    //const [removeItem, setRemoveItem] = useState<productsTypes[]>([]);

    const user = useAuthUsers();

    const getItems = async () => {
        const path = `users/${user?.uid}/products`;

        try {
            const data = await getCollection(path) as productsTypes[];
            if(data) {
                setItemData(data)
            }
            console.log('Productos agregados: ',data);
        } catch (error: unknown) {
            console.log('Error en alo leer productos: ', error)
        }
    };

    useEffect(() => {
        if(user) {
            getItems();
        }
    }, [user]);

  const deleteItem = async (item:productsTypes) => {
    
        const path = `users/${user?.uid}/products/${item.id}`;
    
        try {
            await deleteDocument(path);

            console.log('Elimando productos');

            const newItem = itemData.filter(i => i.id !== item.id);
            setItemData(newItem);
        } catch (error: unknown) {
            console.log('Error al intentar eliminar un producto: ', error)
        }
        
    };



    return (
        <div>
            <CreateProduct getProduct={() => getItems()}/>
            {itemData.map((item) => (
                <div key={item.id} style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
                    <ProductsComponent 
                    name={item.name}
                    price={item.price}
                    soldUnits={item.soldUnits}
                    description={item.description}
                    deleteItem={() => deleteItem(item)}
                    />
                </div>
            ))}
        </div>
    );
};

export default Items;