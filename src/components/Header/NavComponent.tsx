'use client';

import NavStyle from '@/styles/nav.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { signOut } from '@/utils/firebase';
import { useAuthUsers } from '@/features/Auth/hooks/authUsers';
import Image from 'next/image';
import userImg from '../../../public/user.webp';

export const Nav = () => {
    const [scrollY, setScrollY] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const user = useAuthUsers();

    const handleScroll = () => {
        setScrollY(window.scrollY > 350);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <nav className={scrollY ? `${NavStyle.navScroll}` : `${NavStyle.container}`}>
                <Link href='/' className={NavStyle.links}>Home</Link>
                <Link href='/products' className={NavStyle.links}>Productos</Link>
                <Link href='/dashboard' className={NavStyle.links}>Dashboard</Link>
                <Link href='/cart' className={NavStyle.links}>Carrito</Link>
                
                {user ? (
                    <button
                        onClick={() => setOpenMenu(!openMenu)}
                        className={NavStyle.profileButton}
                    >
                        <Image 
                            src={userImg} 
                            width={30} 
                            height={30} 
                            alt='' 
                            className={NavStyle.userImg}
                        />
                    </button>
                ) : (
                    <Link href='/login' className={`${NavStyle.acceso} bg-purple-900 rounded-2xl text-purple-200 font-bold`}>
                        Acceso
                    </Link>
                )}
            </nav>

            {/* Menú desplegable fuera del `nav` */}
            {openMenu && (
                <div className={NavStyle.dropdownMenu}>
                    <Link href= '/account/profile' className={NavStyle.menuItem}>Perfil</Link>
                    <Link href= '' className={NavStyle.menuItem}>Configuración</Link>
                    <button className={NavStyle.logout} onClick={signOut}>
                        Cerrar sesión
                    </button>
                </div>
            )}
        </>
    );
};

export default Nav;



            {/* <Link href='/login' className={`${NavStyle.acceso} bg-purple-900 rounded-2xl text-purple-200 font-bold`}
            onClick={signOut}
            >
            Cerrar Sesión
            </Link> */}