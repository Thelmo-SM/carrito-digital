'use client';


import style from '@/styles/account.module.css';
import CreateAddresses from "./CreateAddresses";
import { useAddresses } from "@/store/AddressContext";
import { useModalForm } from '@/hooks/useModalForm';
import ModalForm from '@/components/Modals/modalForm';


export const AddressesComponent = () => {
    const { addresses, setDefaultAddress } = useAddresses();
      const {isOpen, openModal, closeModal} = useModalForm();
  
    return (
      <div className={style.subContainer}>
        <h2 className={style.title}>Direcciones</h2>
        <button className={style.button}
        onClick={openModal}
        >Agregar nueva direccion</button>
        <ModalForm isOpens={isOpen} closeModal={closeModal}>
        <CreateAddresses />
        </ModalForm>
        {addresses.length > 0 ? (
        <ul className={style.cardContainer}>
          {addresses
            .sort((a, b) => (b.isDefault ? 1 : -1))
            .map((address) => (
              <li key={address.id}
              className={style.address}
              >
                <strong>{address.isDefault ? "★ " : ""}</strong>
                <p>{address.street}, {address.city}, {address.state}, {address.postalCode}, {address.country}</p>
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