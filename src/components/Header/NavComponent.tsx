'use client';

import NavStyle from '@/styles/nav.module.css';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
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
import NavMobile from './NavMobile';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useChatNotificationContext } from '@/features/notifications/hooks/useMessageNotification';

export const Nav = () => {
  const [scrollY, setScrollY] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const user = useAuthUsers();
  const { isOpen, openModal, closeModal } = useModalForm();
  const router = useRouter();
  const { totalItems, setCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false); 
  const [openMenuMobile, setOpenMenuMobile] = useState(false); 
  const { unreadCount, markAllAsRead } = useNotifications();
  const { hasNewNotification, markNotificationsAsSeen } = useChatNotificationContext();
  

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenMenu = () => {
    setOpenMenuMobile(prevState => !prevState); 
  }

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
  
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    console.log('Ancho:', window.innerWidth, 'Alto:', window.innerHeight);
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    if (openMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenu]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      setCart([]);
      router.replace('/login');
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  const isUser = () => {
    if (!user) openModal();
  };

  useEffect(() => {
    markAllAsRead();
  }, []);

  return (
    <div>
        <button
          className={`${openMenuMobile ? NavStyle.openToggleMenu : NavStyle.toggleMenu}`}
          onClick={() => handleOpenMenu()}
        >
          ☰
          {unreadCount > 0 && (
            <span className={NavStyle.notificationNavMobile}>
              {unreadCount}
            </span>
            )}

              {hasNewNotification && (
              <span className={NavStyle.notificationNavMobile}>
              ...
              </span>
              )}
        </button>
{  !isMobile ? <nav className={scrollY ? NavStyle.navScroll : NavStyle.container}>
  <div className={NavStyle.subContainer}>

        {/* Links de navegación */}
          <Link href='/' className={NavStyle.links}>Home</Link>
          <Link href='/products' className={NavStyle.links}>Productos</Link>

          {user?.role === 'admin' && (
            <Link href='/dashboard' className={NavStyle.links}>Dashboard</Link>
          )}

          <Link
            href={!user ? '/' : '/cart'}
            className={NavStyle.linksCart}
            onClick={isUser}
          >
            <Image src={cart} width={30} height={30} alt='Cart' />
            <span className={NavStyle.cartItemCount}>
              {user && totalItems > 0 ? totalItems : 0}
            </span>
          </Link>

          {user ? (
            <div className={NavStyle.accoutNotifications}>
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
                {unreadCount > 0 && (
            <span className={NavStyle.notificationNav}>
              {unreadCount}
            </span>
            )}

              {hasNewNotification && (
              <span className={NavStyle.notificationNav}>
              ...
              </span>
              )}
              </button>
            </div>
          ) : (
            <Link
              href='/login'
              className={NavStyle.acceso}
            >
              Acceso
            </Link>
          )}
          </div>
      </nav>
:
      <NavMobile
      isUser={isUser}
      totalItems={totalItems}
      user={user ?? null} 
      isMenuOpen={openMenuMobile}
      setOpenMenuMobile={setOpenMenuMobile}
      handleSignOut={handleSignOut}
      unreadCount={unreadCount}
      markAllAsRead={markAllAsRead}
      hasNewNotification={hasNewNotification}
      markNotificationsAsSeen={markNotificationsAsSeen}
      />}

      {/* Menú desplegable con animación y ref */}
      {user &&  (
        <div
          ref={dropdownRef}
          className={`${NavStyle.dropdownMenu} ${openMenu ? NavStyle.show : ''}`}
        >
          <span className={NavStyle.userName}>
            {user.name || 'Usuario'}
          </span>
          <Link href='/account/profile' className={NavStyle.menuItem}
          onClick={() => setOpenMenu(false)}
          >Perfil
          </Link>
          <Link href='/account/orders' className={NavStyle.menuItem}
          onClick={() => setOpenMenu(false)}
          >
            Tus pedidos
            </Link>
          <Link href='/account/reviews' className={NavStyle.menuItem}
          onClick={() => setOpenMenu(false)}
          >
            Tus reseñas
            </Link>
          <Link href='/account/addresses' className={NavStyle.menuItem}
          onClick={() => setOpenMenu(false)}
          >
            Direcciones
            </Link>
          <Link href='/account/notifications' className={NavStyle.menuItem}
          onClick={() => {
            markAllAsRead();
            setOpenMenu(false);
          }}
          >
            Notificaciones

            {unreadCount > 0 && (
            <span className={NavStyle.notificationBadge}>
              {unreadCount}
            </span>
            )}
            </Link>
            <Link href='/account/messages' 
            className={NavStyle.menuItem}
            onClick={() => {
              markNotificationsAsSeen()
            }
            }
            >
              Mensajes
              {hasNewNotification && (
              <span className={NavStyle.notificationBadge}>
              ...
              </span>
        )}
            </Link>
          <button className={NavStyle.logout} onClick={handleSignOut}>
            {loading ? <LoaderUi /> : 'Cerrar sesión'}
          </button>
        </div>
      )}

      <ModalForm isOpens={isOpen} closeModal={closeModal}>
        <IsAuthenticated />
      </ModalForm>
    </div>
  );
};

export default Nav;
