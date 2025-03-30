
import CartComponent from '@/features/ProductsComponents/Cart/CartComponent';
import styles from '@/styles/cart.module.css';

export const ShoppingCart = () => {
    return (
        <section className={styles.container}>
            <h1 className={styles.titulo}>Carrito de compras</h1>
                <CartComponent/>
        </section>
    )
}

export default ShoppingCart;