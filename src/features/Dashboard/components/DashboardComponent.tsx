'use client';

// import { signOut } from "@/utils/firebase"
// import Items from "./Items";
import Style from '@/styles/dashboard.module.css';
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import { useModalForm } from '@/hooks/useModalForm';
import ModalForm from '@/components/Modals/modalForm';
import CreateProduct from './CreateProduct';
import { productsTypes } from "@/types/productTypes";
import { deleteDocument, getCollection } from "@/utils/firebase";
import { useState } from 'react';
import ProductsComponent from '@/components/ProductsComponents/ProductsComponents';
import StyleProducts from '@/styles/products.module.css'


export const DashboardComponent = () => {
    const [itemData, setItemData] = useState<productsTypes[]>([])
    const {isOpen, openModal, closeModal} = useModalForm();
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
        <div className={Style.container}>
            <h2>Administración</h2>
            <h3>{user?.email}</h3>

        <div className={Style.form}>
            <h3>Mis productos</h3>
            <button className={Style.crear}
            onClick={openModal}
            >
                Agregar nuevo producto
            </button>
            <ModalForm isOpens={isOpen} closeModal={closeModal}>
                <CreateProduct getProduct={() => getItems()} />
            </ModalForm>
        </div>

                <div className={StyleProducts.container}>
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
        </div>
    )
}

export default DashboardComponent;