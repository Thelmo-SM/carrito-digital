'use client';

import { useState } from 'react';
import style from '@/styles/account.module.css';
import { useAuthUsers } from '@/features/Auth/hooks/authUsers';
import Image from 'next/image';
import imgUser from '../../../../public/user.webp';
import { useModalForm } from '@/hooks/useModalForm';
import ModalForm from '@/components/Modals/modalForm';
import UpdateProfile from './UpdateProfile';
import Style from '@/styles/cart.module.css';
import Link from 'next/link';
import { useAddresses } from '@/store/AddressContext';
import { LoaderUi } from '@/components/UI/LoaderUi';
import FeaturesReviews from '../ReviewsComponent/FeaturesReviews';

export const ProfileComponent = () => {
    const user = useAuthUsers();
    const { isOpen, openModal, closeModal } = useModalForm();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
        const { defaultAddress, addresses, loading } = useAddresses();

    const formatDate = (timestamp?: { seconds: number; nanoseconds: number }) => {
        if (!timestamp) return "Cargando fecha...";
        return new Date(timestamp.seconds * 1000).toLocaleString();
    };

    const handleSuccess = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 3000); // Ocultar el mensaje después de 3 segundos
    };

    return (
        <div className={style.subContainer}>
            <div className={style.successMessage}>
            {successMessage && <p className={style.successMessage}>{successMessage}</p>} {/* Mostrar mensaje */}
            </div>
            
            <div className={style.userContainer}>
                <div className={style.imgContainer}>
                    {loading ? <LoaderUi /> : <Image 
                        src={user?.image || imgUser} 
                        width={200}
                        height={200} 
                        alt="Imagen del perfil" 
                        className={style.image}
                    />}
                </div>
                <div className={style.userInfo}>
                    <h2>{user?.name} {user?.lastName}</h2>
                    <p className={style.email}>{user?.email}</p>
                    <p>Te uniste el {formatDate(user?.createdAt)}</p>
                </div>
                <button className={style.editar} onClick={openModal}>Editar</button>
            </div>

            <ModalForm isOpens={isOpen} closeModal={closeModal}>
                <UpdateProfile closeModal={closeModal} onSuccess={handleSuccess} />
            </ModalForm>
            <div className={style.addressContainer}>
                {/* Mostrar la dirección predeterminada */}
                <p className={Style.addressTile}>★ Dirección predeterminada</p>
                <p className={Style.address}>
                    {defaultAddress?.street}, {defaultAddress?.city}, {defaultAddress?.state}, {defaultAddress?.postalCode}, {defaultAddress?.country}
                </p>
                <Link 
                href='/account/addresses'
                className={Style.newAddress}
                >
                {addresses.length === 0 ? 'Agregar dirección' :'Cambiar'}
                </Link>
            </div>
            <FeaturesReviews />
        </div>
    );
};

export default ProfileComponent;
