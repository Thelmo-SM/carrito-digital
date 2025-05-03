import Link from "next/link";
import cart from "../../../public/cart.webp";
import Image from "next/image";
// import userImg from '../../../public/user.webp';
import styles from "@/styles/NavMobile.module.css";
import { dataUsersTypes } from "@/types/usersTypes";
import { DocumentData } from "firebase/firestore";




type NavMobileProps = {
  user: dataUsersTypes | DocumentData | null;
  isUser: () => void;
  totalItems: number;
  isMenuOpen: boolean;
  setOpenMenuMobile: (open: boolean) => void;
  handleSignOut: () => void;
  unreadCount: number;
};

export const NavMobile = ({ user, isUser, totalItems, isMenuOpen, setOpenMenuMobile, handleSignOut, unreadCount }: NavMobileProps) => {
    return (
      <nav className={`${!isMenuOpen ? styles.nav : styles.containerShow}`}>
        <Link href="/" className={styles.link}
        onClick={() => setOpenMenuMobile(false)}
        >Home</Link>
        <Link href="/products" className={styles.link}
        onClick={() => setOpenMenuMobile(false)}
        >Productos</Link>
  
        {user?.role === "admin" && (
          <Link href="/dashboard" className={styles.link}
          onClick={() => setOpenMenuMobile(false)}
          >Dashboard</Link>
        )}
  
        <div className={styles.cartContainer}>
          <Link href={!user ? "/" : "/cart"} className={styles.link} onClick={() => {
            isUser();
            setOpenMenuMobile(false);
          }}>
            <div className={styles.totalCart}>
              <Image src={cart} width={30} height={30} alt="Cart" />
              <span className={styles.cartItemCount}>{user && totalItems > 0 ? totalItems : 0}</span>
            </div>
          </Link>
        </div>


  
        {user ? (
          <>
                  <Link href='/account/profile' className={styles.link}
                  onClick={() => setOpenMenuMobile(false)}
                  > Perfil
                  </Link>
                  <Link href='/account/orders' className={styles.link}
                  onClick={() => setOpenMenuMobile(false)}
                  >
                    Tus pedidos
                    </Link>
                  <Link href='/account/reviews' className={styles.link}
                  onClick={() => setOpenMenuMobile(false)}
                  >
                    Tus reseñas
                    </Link>
                  <Link href='/account/addresses' className={styles.link}
                  onClick={() => setOpenMenuMobile(false)}
                  >
                    Direcciones
                    </Link>
                  <Link href='/notifications' className={styles.link}
                  onClick={() => setOpenMenuMobile(false)}
                  >
                    Notificaciones

                    {unreadCount > 0 && (
                    <span className={styles.notificationBadge}>
                      {unreadCount}
                    </span>
                   )}
                    </Link>
{/*////////////////////////////////////////////////////*/}
          <button
            className={styles.logout}
            onClick={() => {
              handleSignOut();
              setOpenMenuMobile(false);
            }}
            aria-label="Abrir menú de usuario"
          >
          Cerrar sesión
          </button>
          </>
        ) : (
          <Link href="/login" className={styles.acceso}
          onClick={() => setOpenMenuMobile(false)}
          >Acceso</Link>
        )}
        
      </nav>
    );
  };

export default NavMobile;
