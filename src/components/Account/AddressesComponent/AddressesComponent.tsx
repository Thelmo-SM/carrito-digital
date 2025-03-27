'use client';


import style from '@/styles/account.module.css';
import CreateAddresses from "./CreateAddresses";
import { useAddresses } from "@/store/AddressContext";


export const AddressesComponent = () => {
    const { addresses, setDefaultAddress } = useAddresses();
  
    return (
      <div className={style.subContainer}>
        <h2>Direcciones</h2>
        <CreateAddresses />
        {addresses.length > 0 ? (
        <ul>
          {addresses
            .sort((a, b) => (b.isDefault ? 1 : -1))
            .map((address) => (
              <li key={address.id}>
                <strong>{address.isDefault ? "★ " : ""}</strong>
                {address.street}, {address.city}, {address.state}, {address.postalCode}, {address.country}
                {!address.isDefault && (
                  <button onClick={() => setDefaultAddress(address.id)}>Establecer como predeterminada</button>
                )}
              </li>
            ))}
        </ul>
      ) : (
        <p>No tienes direcciones guardadas.</p>
      )}
      </div>
    );
  };

export default AddressesComponent;