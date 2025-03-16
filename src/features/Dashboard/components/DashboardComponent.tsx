'use client';

//import { signOut } from "@/utils/firebase"
// import Items from "./Items";
import Style from '@/styles/dashboard.module.css';
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import { useModalForm } from '@/hooks/useModalForm';
import ModalForm from '@/components/Modals/modalForm';
import CreateProduct from './CreateProduct';
import { productsTypes } from "@/types/productTypes";
import { deleteDocument, getCollection } from "@/utils/firebase";
import { useEffect, useState } from 'react';
import { formatPrice } from '../helpers/formatPrice';
import Image from 'next/image';
import  UpdateProducts  from './UpdateProducts';
//import img from '../../../../public/ewfrtew.jpg'


export const DashboardComponent = () => {
    const [itemData, setItemData] = useState<productsTypes[]>([])
    const [modalType, setModalType] = useState<'create' | 'edit' | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<productsTypes | null>(null);
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
         
         useEffect(() => {
            if (user) {
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

            // 👉 Ubicación de handleOpenModal dentro del componente, antes del return
        const handleOpenModal = (type: 'create' | 'edit', product?: productsTypes) => {
          setModalType(type);
          if (type === 'edit' && product) {
              setSelectedProduct(product);
          } else {
              setSelectedProduct(null);
          }
          openModal();
      };


    return (
        <div className={Style.container}>
            <h2>Administración</h2>
            <h3>{user?.email}</h3>

        <div className={Style.form}>
            <h3>Mis productos</h3>
            <button className={Style.crear} onClick={() => handleOpenModal('create')}>
                Agregar nuevo producto
            </button>
            <ModalForm isOpens={isOpen} closeModal={closeModal}>
             {modalType === 'create' ? (
                 <CreateProduct getProduct={getItems} />
             ) : modalType === 'edit' && selectedProduct ? (
                 <UpdateProducts product={selectedProduct} getProduct={getItems} />
             ) : null}
            </ModalForm>
        </div>

            <article className={Style.cardContainer}>
            <table className={Style.table}>
  <thead>
    <tr className={Style.tr}>
      <th className={Style.th}>Imagen</th>
      <th className={Style.th}>Nombre</th>
      <th className={Style.th}>Precio</th>
      <th className={Style.th}>Unidad</th>
      <th className={Style.th}>Editar</th>
      <th className={Style.th}>Eliminar</th>
    </tr>
  </thead>
  <tbody>
    {itemData.map((item, index) => (
      <tr key={`${item.id} ${index}`} className={Style.tr}>
        <td className={Style.td}>
        {item.imageUrl ? (
   <Image
      src={item.imageUrl}
      width={150}
      height={100}
      alt={item.name}
      className={Style.img}
   />
) : (
   <p>No hay imagen disponible</p>
)}
        </td>
        <td className={Style.td}>{item.name}</td>
        <td className={Style.td}>
          <p className={Style.price}>{formatPrice(Number(item.price))}</p>
        </td>
        <td className={Style.td}>{item.soldUnits}</td>
        <td className={Style.td}>
        <button className={Style.buttonFirst} onClick={() => handleOpenModal('edit', item)}>
            Editar
        </button>
        </td>
        <td className={Style.td}>
          <button
            onClick={() => deleteItem(item)}
            className={Style.buttonLast}
          >
            Eliminar
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
            </article>
        </div>
    )
}

export default DashboardComponent;