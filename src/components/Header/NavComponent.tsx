'use client';

import NavStyle from '@/styles/nav.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { signOut } from '@/utils/firebase';
import { useAuthUsers } from '@/features/Auth/hooks/authUsers';



export const Nav = () => {
    const [scrollY, setScrollY] = useState(false);
    const user = useAuthUsers();
 

    const handleScroll = () => {

        const scrolledY = window.scrollY; 

        if(scrolledY > 350) {
            setScrollY(true);
        } else {
            setScrollY(false)
        }
      };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={scrollY ? `${NavStyle.navScroll}` : `${NavStyle.container}`}>
            <Link href='/' className={NavStyle.links}>Home</Link>
            <Link href='/products' className={NavStyle.links}>Productos</Link>
            <Link href='/dashboard' className={NavStyle.links}>Dashboard</Link>
            { user ? <Link href='/login' className={`${NavStyle.acceso} bg-purple-900 rounded-2xl text-purple-200 font-bold`}
            onClick={signOut}
            >
            Cerrar Sesión
            </Link>: <Link href='/login' className={`${NavStyle.acceso} bg-purple-900 rounded-2xl text-purple-200 font-bold`}
            >
            Accesso
            </Link>}
        </nav>
    );
};

export default Nav;