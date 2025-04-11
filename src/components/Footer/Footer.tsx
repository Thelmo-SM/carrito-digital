// components/Footer.tsx
import Link from "next/link";
import styles from "@/styles/footer.module.css";

const Footer = () => {
    return (
      <footer>
        <div className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.branding}>
            <h3>Carrito Digital</h3>
            <p>Descubre la mejor selección de PCs, tabletas, 
                televisores, consolas y más, todo en un solo lugar.
                 ¡Tecnología de vanguardia para todos!</p>
          </div>
  
          <div className={styles.navLinks}>
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li>
                <Link href="/about">Sobre Nosotros</Link>
              </li>
              <li>
                <Link href="/products">Productos</Link>
              </li>
              <li>
                <Link href="/contact">Contáctanos</Link>
              </li>
              <li>
                <Link href="/privacy-policy">Política de Privacidad</Link>
              </li>
              <li>
                <Link href="/terms-of-service">Términos de Servicio</Link>
              </li>
            </ul>
          </div>
  
          <div className={styles.contactInfo}>
            <h4>Contáctanos</h4>
            <p>Correo eletrónico: toraphebi@gmail.com</p>
            <p>Teléfono: +1 234 567 890</p>
          </div>
  
          <div className={styles.socialLinks}>
            <h4>Síguenos</h4>
            <ul>
              <li>
                <Link href="https://facebook.com/elegancestudio" target="_blank">Facebook</Link>
              </li>
              <li>
                <Link href="https://instagram.com/elegancestudio" target="_blank">Instagram</Link>
              </li>
              <li>
                <Link href="https://twitter.com/elegancestudio" target="_blank">Twitter</Link>
              </li>
            </ul>
          </div>
        </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2025 Elegance Studio. Todos los derechos reservados.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;