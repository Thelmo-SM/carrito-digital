'use client';

import style from '@/styles/account.module.css';
import { useAuthUsers } from '@/features/Auth/hooks/authUsers';
import Image from 'next/image';
import imgUser from '../../../../public/user.webp';


export const ProfileComponent = () => {
    const user = useAuthUsers();

    const formatDate = (timestamp?: { seconds: number; nanoseconds: number }) => {
        if (!timestamp) return "Fecha no disponible";
        return new Date(timestamp.seconds * 1000).toLocaleString();
      };

    return (
        <div className={style.subContainer}>
            <div className={style.userContainer}>
                <Image src={imgUser} width={200} height={200} alt='' />
                <div className={style.userInfo}>
                <h2>{user?.name} {user?.lastName}</h2>
                <p>{user?.email}</p>
                <p>Te uniste el {formatDate(user?.createdAt)}</p>
                </div>
                <button className={style.editar}>Editar</button>
            </div>
        </div>
    );
};

export default ProfileComponent;