import Image from "next/image";
import Link from "next/link";
import img from '../../public/404.webp';
import styles from '@/styles/NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <p className={styles.message}>
        Lo sentimos, la página que buscas no existe o fue movida.
      </p>
      <Link href="/" className={styles.link}>
        Volver al inicio
      </Link>
      <Image src={img} width={1000} height={900} alt="Página no encontrada" className={styles.image} />
    </div>
  );
}
