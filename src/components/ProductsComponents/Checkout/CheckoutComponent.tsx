'use client';

import { formatPrice } from '@/features/Dashboard/helpers/formatPrice';
import styles from '@/styles/cart.module.css';

interface checkoutType {
    totalCart: number;
    handleOrder: () => void;
}

export const CheckoutComponent = ({ totalCart, handleOrder }: checkoutType) => {
    return (
        <div className={styles.totalContainer}>
            <div className={styles.detalleTotal}>
                <h2>Total del carrito</h2>
                <p>Sub total: <span className='text-green-600'>{formatPrice(totalCart)}</span></p>
                <p>Total: <span className='text-green-600 font-bold'>{formatPrice(totalCart)}</span></p>
            </div>
            <button onClick={handleOrder} className={styles.activeButton}>
                Realizar pedido
            </button>
        </div>
    );
};

export default CheckoutComponent;