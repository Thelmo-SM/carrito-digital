'use client';

import { useState, useEffect } from "react";
import { getUserAddresses } from "@/utils/firebase";  // Importamos la función para obtener direcciones
import { useAuthUsers } from '@/features/Auth/hooks/authUsers'; // Para obtener el usuario autenticado
import { ShippingAddress } from "@/types/ordersTypes";
import style from '@/styles/account.module.css';
import CreateAddresses from "./CreateAddresses";


export const AddressesComponent = () => {
    const [addresses, setAddresses] = useState<ShippingAddress[]>([]);  // Estado para las direcciones
    const user = useAuthUsers(); // Obtener el usuario autenticado
  
    useEffect(() => {
      if (!user?.uid) return;
  
      const fetchAddresses = async () => {
        try {
          const userAddresses = await getUserAddresses(user.uid);  // Obtener direcciones
          setAddresses(userAddresses);
        } catch (error) {
          console.error("Error cargando direcciones:", error);
        }
      };
  
      fetchAddresses();
    }, [user]);
  
    return (
      <div className={style.subContainer}>
        <h2>Direcciones</h2>
        <CreateAddresses />
        {addresses.length === 0 ? (
          <p>No tienes direcciones guardadas.</p>
        ) : (
          <ul>
            {addresses.map((address) => (
              <li key={address.id}>
                <h3>Dirección #{address.id}</h3>
                <p>{address.street}, {address.city}, {address.state}, {address.postalCode}, {address.country}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

export default AddressesComponent;