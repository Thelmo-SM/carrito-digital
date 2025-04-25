import Link from "next/link";
import cart from "../../../public/cart.webp";
import Image from "next/image";
import styles from "@/styles/NavMobile.module.css";
import { dataUsersTypes } from "@/types/usersTypes";
import { DocumentData } from "firebase/firestore";




type NavMobileProps = {
  user: dataUsersTypes | DocumentData | null;
  isUser: () => void;
  totalItems: number;
  isMenuOpen: boolean;
  setOpenMenuMobile: (open: boolean) => void;
};

export const NavMobile = ({ user, isUser, totalItems, isMenuOpen, setOpenMenuMobile }: NavMobileProps) => {
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
          <Link href={!user ? "/" : "/cart"} className={styles.link} onClick={isUser}>
            <div className={styles.totalCart}>
              <Image src={cart} width={30} height={30} alt="Cart" />
              <span>{user && totalItems > 0 ? totalItems : 0}</span>
            </div>
          </Link>
        </div>
  
        {user ? (
          <button
            className={styles.button}
            aria-label="Abrir menú de usuario"
          >
            <Image
              src={user.image || ''}
              width={30}
              height={30}
              alt="Usuario"
              className={styles.avatar}
            />
          </button>
        ) : (
          <Link href="/login" className={styles.acceso}
          onClick={() => setOpenMenuMobile(false)}
          >Acceso</Link>
        )}
      </nav>
    );
  };

export default NavMobile;
