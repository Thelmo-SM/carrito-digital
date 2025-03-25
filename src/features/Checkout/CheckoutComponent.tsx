'use client';

import { formatPrice } from '@/features/Dashboard/helpers/formatPrice';
import styles from '@/styles/cart.module.css';

interface checkoutType {
    totalCart: number;
    handleOrder: () => void;
    openModal: () => void;
    setAddressFormVisible: (value: boolean) => void; 
    shippingAddress: null;
    isAddressFormVisible: boolean;
}

export const CheckoutComponent = ({ totalCart, handleOrder, openModal,setAddressFormVisible, shippingAddress, isAddressFormVisible }: checkoutType) => {
    




    return (
        <div className={styles.totalContainer}>
            <div className={styles.detalleTotal}>
                <h2>Total del carrito</h2>
                <p>Sub total: <span className='text-green-600'>{formatPrice(totalCart)}</span></p>
                <p>Total: <span className='text-green-600 font-bold'>{formatPrice(totalCart)}</span></p>
            </div>
            {!shippingAddress && !isAddressFormVisible &&  (
            <button 
            onClick={() => {
                openModal()
                setAddressFormVisible(true)
            }
            } 
            className={styles.activeButton}
            >
                Agregar Dirrección de Envío
            </button>
        )}

            <button onClick={handleOrder} className={styles.activeButton}>
                Realizar pedido
            </button>
        </div>
    );
};

export default CheckoutComponent;