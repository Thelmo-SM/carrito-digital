'use client';


import style from '@/styles/account.module.css';
import CreateAddresses from "./CreateAddresses";
import { useAddresses } from "@/store/AddressContext";
import { useModalForm } from '@/hooks/useModalForm';
import ModalForm from '@/components/Modals/modalForm';
import { LoaderUi } from '@/components/UI/LoaderUi';
import { useMemo } from 'react';


export const AddressesComponent = () => {
    const { addresses, loading, setDefaultAddress } = useAddresses();
      const {isOpen, openModal, closeModal} = useModalForm();

      const sortedAddresses = useMemo(
        () => [...addresses].sort((a, b) => (b.isDefault ? 1 : -1)),
        [addresses]
      );
  
    return (
      <div className={style.subContainer}>
        <h2 className={style.title}>Direcciones</h2>
        <button className={style.button}
        onClick={openModal}
        >Agregar nueva direccion</button>
        <ModalForm isOpens={isOpen} closeModal={closeModal}>
        <CreateAddresses />
        </ModalForm>
        {
        loading ? (
          <div className={style.loadingContainer}>
          <LoaderUi />
          <p>{"Cargando tus direcciones..."}</p>
          </div>
        ) : sortedAddresses.length === 0 ? (
          <p>No tienes direcciones</p>
        ) : (
          <ul className={style.cardContainer}>
          {sortedAddresses
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
      )
      }
      </div>
    );
  };

export default AddressesComponent;