'use client';

import NavStyle from '@/styles/nav.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export const Nav = () => {
    const [scrollY, setScrollY] = useState(false);
 

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
            <Link href='/home' className={NavStyle.links}>Home</Link>
            <Link href='/products' className={NavStyle.links}>Productos</Link>
            <Link href='/dashboard' className={NavStyle.links}>Dashboard</Link>
            <Link href='/login' className={`${NavStyle.acceso} bg-purple-900 rounded-2xl text-purple-200 font-bold`}>Acceso</Link>
        </nav>
    );
};

export default Nav;