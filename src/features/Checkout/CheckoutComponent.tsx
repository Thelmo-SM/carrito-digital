'use client';

import { formatPrice } from '@/features/Dashboard/helpers/formatPrice';
import styles from '@/styles/cart.module.css';
import { useAddresses } from '@/store/AddressContext';
import { ShippingAddress } from '@/types/ordersTypes';
import Link from 'next/link';

interface checkoutType {
    totalCart: number;
    handleOrder: () => void;
   // setAddressFormVisible: (value: boolean) => void; 
    shippingAddress: ShippingAddress | null;
    //isAddressFormVisible: boolean;
}

export const CheckoutComponent = ({ totalCart, handleOrder}: checkoutType) => {
    const { defaultAddress } = useAddresses(); // Obtener la dirección predeterminada

    return (
        <div className={styles.totalContainer}>
            <div className={styles.detalleTotal}>
                <h2>Total del carrito</h2>
                <p>Sub total: <span className='text-green-600'>{formatPrice(totalCart)}</span></p>
                <p>Total: <span className='text-green-600 font-bold'>{formatPrice(totalCart)}</span></p>
            </div>

            <div className={styles.addressContainer}>
                {/* Mostrar la dirección predeterminada */}
                <p className={styles.addressTile}>★ Dirección predeterminada</p>
                <p className={styles.address}>
                    {defaultAddress?.street}, {defaultAddress?.city}, {defaultAddress?.state}, {defaultAddress?.postalCode}, {defaultAddress?.country}
                </p>
                <Link 
                href='/account/addresses'
                className={styles.newAddress}
                >
                Cambiar
                </Link>
            </div>

            <button onClick={handleOrder} className={styles.activeButton}>
                Realizar pedido
            </button>
        </div>
    );
};

export default CheckoutComponent;
