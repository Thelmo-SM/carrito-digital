'use client';

import styles from '@/styles/cart.module.css'; // Asegúrate de que la ruta sea correcta
import { useCart } from '@/store/ProductCartContext';
import { useAuthUsers } from '@/features/Auth/hooks/authUsers';
//import { useRouter } from 'next/navigation';

export const CartComponent = () => {
    const user = useAuthUsers();
    const { cart, deleteProduct } = useCart();
    console.log('productos del carrito: ', cart);

    const handleOrder = async () => {
        if (!user || !user.uid) {
            alert("Por favor, inicie sesión para realizar un pedido.");
            return;
        }

        // Verificación de carrito vacío
        if (!cart || cart.length === 0) {
            console.log('El carrito está vacío');
            return;
        }

        // Verificación de que todos los elementos en el carrito tengan un ID
        const productIds = cart.map(item => {
            if (!item.id) {
                console.error("Un producto en el carrito no tiene un ID válido:", item);
                return null;
            }
            return item.id;
        }).filter(id => id !== null); // Filtra los valores nulos

        // Verificación de que hay productos válidos en el carrito
        if (productIds.length === 0) {
            alert("No hay productos válidos en el carrito.");
            return;
        }
    };

    const totalCart = cart.reduce((acc, item) => acc + (item.price || 0), 0);

    return (
        <div className={styles.cartContainer}>
            <div>
                <table className={styles.cartTable}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>ID</th>
                            <th>Total</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.length > 0 ? (
                            cart.map(({ name, description, price, id }, index) => (
                                <tr key={index}>
                                    <td>{name}</td>
                                    <td>{description}</td>
                                    <td className="text-green-600">{price}</td>
                                    <td>{id}</td>
                                    <td className="text-green-600">{price}</td>
                                    <td>
                                        <button
                                            className={styles.cartButton}
                                            onClick={() => {
                                               if(id) deleteProduct(id)
                                            }}
                                        >
                                            X
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className={styles.emptyCartMessage}>
                                    You have no product added to the cart
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className={styles.cartTotal}>
                <h2>Total del carrito</h2>
                <p>Sub total: <span className="text-green-600">{totalCart}</span></p>
                <p>Total: <span className="text-green-600 font-bold">{totalCart}</span></p>
            </div>

            <button className={styles.cartButton} onClick={handleOrder} disabled={cart.length === 0}>
                Place order
            </button>
        </div>
    );
};

export default CartComponent;
