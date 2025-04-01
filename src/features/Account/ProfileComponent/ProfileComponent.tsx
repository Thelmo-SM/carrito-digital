'use client';

import { useState } from 'react';
import style from '@/styles/account.module.css';
import { useAuthUsers } from '@/features/Auth/hooks/authUsers';
import Image from 'next/image';
import imgUser from '../../../../public/user.webp';
import { useModalForm } from '@/hooks/useModalForm';
import ModalForm from '@/components/Modals/modalForm';
import UpdateProfile from './UpdateProfile';

export const ProfileComponent = () => {
    const user = useAuthUsers();
    const { isOpen, openModal, closeModal } = useModalForm();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const formatDate = (timestamp?: { seconds: number; nanoseconds: number }) => {
        if (!timestamp) return "Fecha no disponible";
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
                    <Image 
                        src={user?.image || imgUser} 
                        width={200}
                        height={200} 
                        alt="Imagen del perfil" 
                        className={style.image}
                    />
                </div>
                <div className={style.userInfo}>
                    <h2>{user?.name} {user?.lastName}</h2>
                    <p>{user?.email}</p>
                    <p>Te uniste el {formatDate(user?.createdAt)}</p>
                </div>
                <button className={style.editar} onClick={openModal}>Editar</button>
            </div>

            <ModalForm isOpens={isOpen} closeModal={closeModal}>
                <UpdateProfile closeModal={closeModal} onSuccess={handleSuccess} />
            </ModalForm>
        </div>
    );
};

export default ProfileComponent;
