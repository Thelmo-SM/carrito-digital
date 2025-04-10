'use client';

import NavStyle from '@/styles/nav.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { signOut } from '@/utils/firebase';
import { useAuthUsers } from '@/features/Auth/hooks/authUsers';
import Image from 'next/image';
import userImg from '../../../public/user.webp';
import cart from '../../../public/cart (1).webp';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/ProductCartContext';
import { LoaderUi } from '../UI/LoaderUi';
import ModalForm from '../Modals/modalForm';
import { IsAuthenticated } from '../UI/Message';
import { useModalForm } from '@/hooks/useModalForm';

export const Nav = () => {
  const [scrollY, setScrollY] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useAuthUsers();
  const { isOpen, openModal, closeModal } = useModalForm();
  const router = useRouter();
  const { totalItems, setCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      setCart([]); // Limpiar el carrito del estado
      router.replace('/login');
    } catch (error: unknown) {
      console.log('Error al cerrar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  const isUser = () => {
    if(!user) {
      openModal();
    };
  };
  
  return (
    <>
      <nav className={scrollY ? `${NavStyle.navScroll}` : `${NavStyle.container}`}>
        <Link href='/' className={NavStyle.links}>Home</Link>
        <Link href='/products' className={NavStyle.links}>Productos</Link>
        {user && (
        <Link href='/dashboard' className={NavStyle.links}>Dashboard</Link>
        )}

        <Link href={!user ? '/' : '/cart'} 
        className={NavStyle.linksCart}
        onClick={isUser}
        >
          <Image src={cart} width={30} height={30} alt='Cart' />
          <span className={NavStyle.cartItemCount}>
           {user && totalItems > 0 ? totalItems : 0}
          </span>
        </Link>

        {user ? (
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className={NavStyle.profileButton}
            aria-label="Abrir menú de usuario"
          >
            <Image
              src={user.image || userImg}
              width={30}
              height={30}
              alt='Usuario'
              className={NavStyle.userImg}
            />
          </button>
        ) : (
          <Link
            href='/login'
            className={`${NavStyle.acceso} bg-purple-900 rounded-2xl text-purple-200 font-bold`}
          >
            Acceso
          </Link>
        )}
      </nav>

      {/* Menú desplegable */}
      {user && openMenu && (
        <div className={NavStyle.dropdownMenu}>
          <span className={NavStyle.userName}>
            {user.name || 'Usuario'}
          </span>
          <Link href='/account/profile' className={NavStyle.menuItem}>Perfil</Link>
          <Link href='/account/settings' className={NavStyle.menuItem}>Configuración</Link>
          <button className={NavStyle.logout} onClick={handleSignOut}>
            {loading ? <LoaderUi /> : 'Cerrar sesión'}
          </button>
        </div>
      )}
      <ModalForm isOpens={isOpen} closeModal={closeModal}>
                    
             <IsAuthenticated />
                    
      </ModalForm>
    </>
  );
};

export default Nav;
