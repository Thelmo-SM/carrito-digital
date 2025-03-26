import styles from '@/styles/account.module.css';
import Link from 'next/link';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className={styles.container}>
        <header className={styles.headerContainer}>
          {/* Aquí puedes incluir un header global */}
          <nav className={styles.nav}>
          <div>
          <Link href= '/account/profile' >Perfil</Link>
          </div>
          <div>
          <Link href= '/account/orders' >Tus pedidos</Link>
          </div>
          <div>
          <Link href= '' >Tus reseñas</Link>
          </div>
          <div>
          <Link href= '' >Direcciones</Link>
          </div>
          <div>
          <Link href= '' >Notificaciones</Link>
          </div>
          </nav>

        </header>
        <main className="flex-1">{children}</main>
      </div>
    );
  };
  
  export default Layout;