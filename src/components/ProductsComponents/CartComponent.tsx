'use client';

import styles from '@/styles/cart.module.css'; // Asegúrate de que la ruta sea correcta
import { useCart } from '@/store/ProductCartContext';
import { useAuthUsers } from '@/features/Auth/hooks/authUsers';
import Image from 'next/image';
import { formatPrice } from '@/features/Dashboard/helpers/formatPrice';
//import { useRouter } from 'next/navigation';

export const CartComponent = () => {
    const user = useAuthUsers();
    const { cart, deleteProduct, updateProductQuantity } = useCart(); // Asegúrate de tener `updateProductQuantity` en tu contexto
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

    const totalCart = cart.reduce((acc, item) => acc + (item.price || 0) * (item.soldUnits || 1), 0); // Total del carrito con cantidades

    return (
        <div className={styles.subContainer}>
            <div className={styles.tableAndButton}>
                <table className={styles.tableContainer}>
                    <thead className={styles.thead}>
                        <tr className={styles.thead}>
                            <th>Producto</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.length > 0 ? (
                            cart.map(({ name, price, id, imageUrl, soldUnits }, index) => (
                                <tr key={index}>
                                    <td>
                                    {imageUrl ? (
                                      <Image
                                         src={imageUrl}
                                         width={100}
                                         height={100}
                                         alt={name}
                                         className={styles.img}
                                       />
                                    ) : (
                                       <p>No hay imagen disponible</p>
                                    )}
                                    </td>
                                    <td>{name}</td>
                                    <td className="text-green-600">{formatPrice(Number(price))}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={soldUnits}
                                            onChange={(e) => {
                                                const newQuantity = Number(e.target.value);
                                                if (newQuantity == 0) {
                                                    updateProductQuantity(id, newQuantity); // Actualiza la cantidad
                                                }
                                            }}
                                            min="1"
                                            max='1'
                                            className={styles.quantityInput}
                                        />
                                    </td>
                                    <td className="text-green-600">{formatPrice(Number(price) * soldUnits!)}</td>
                                    <td>
                                        <button
                                            className={styles.cartButton}
                                            onClick={() => {
                                               if(id) deleteProduct(id);
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

            <div className={styles.totalContainer}>
            <div className={styles.detalleTotal}>
            <h2>Total del carrito</h2>
            <p>Sub total: <span className='text-green-600'>{formatPrice(Number(totalCart))}</span></p>
            <p>Total: <span className='text-green-600 font-bold'>{formatPrice(Number(totalCart))}</span></p>
            </div>
            <button onClick={handleOrder} disabled={cart.length === 0} className={styles.activeButton}>Place order</button>
        </div>
        </div>
    );
};

export default CartComponent;