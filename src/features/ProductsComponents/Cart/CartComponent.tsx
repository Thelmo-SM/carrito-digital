'use client';

import styles from '@/styles/cart.module.css'; // Asegúrate de que la ruta sea correcta
import { useCart } from '@/store/ProductCartContext';
import { useAuthUsers } from '@/features/Auth/hooks/authUsers';
import { useAddresses } from "@/store/AddressContext";  // Asegúrate de importar el hook para obtener las direcciones
import Image from 'next/image';
import { formatPrice } from '@/features/Dashboard/helpers/formatPrice';
import CheckoutComponent from '../../Checkout/CheckoutComponent';
import { useState } from 'react';
//import { LoaderUi } from '@/components/UI/LoaderUi';

export const CartComponent = () => {
    const user = useAuthUsers();
    const [loading1, setLoading1] = useState(false);
    const { cart, deleteProduct, updateProductQuantity, setCart } = useCart();
    const { defaultAddress, loading } = useAddresses(); // Obtener la dirección predeterminada

    const handleOrder = async () => {
        if (!user?.uid) {
          alert("Por favor, inicie sesión para realizar un pedido.");
          return;
        }
      
        if (cart.length === 0) {
          alert("El carrito está vacío.");
          return;
        }
      
        const productIds = cart.map(item => item.id).filter(id => id !== null);
        if (productIds.length === 0) {
          alert("No hay productos válidos en el carrito.");
          return;
        }
      
        // Verificar si la dirección de envío es válida
        if (!defaultAddress) {
          alert("No tienes una dirección de envío predeterminada.");
          return;
        }
      
        // Preparar los datos para el backend
        const orderData = {
          userId: user.uid,
          products: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.units ?? 1,
            imageUrl: item.imageUrl
          })),
          total: totalCart,
          shippingAddress: defaultAddress,  // Usar la dirección predeterminada
        };
      
        try {
          setLoading1(true);
          // Enviar los datos al backend para crear el pedido
          const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
          });
      
          const data = await response.json();
      
          // Revisar si la respuesta contiene la URL de Stripe
          if (response.ok && data.url) {
            // Redirigir al usuario a la URL de Stripe
            window.location = data.url;
          } else {
            console.error('Error en la respuesta:', data);
            alert("Hubo un problema al procesar el pedido.");
          }
        } catch (error) {
          alert("Error al procesar el pedido.");
          console.error(error);
        } finally {
          setLoading1(false);
        }
      };

    const totalCart = cart.reduce((acc, item) => acc + (item.price || 0) * (item.units ?? 1), 0);

    if (loading) return <p>Cargando direcciones...</p>; // Si las direcciones aún están cargando

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
                            cart.map(({ name, price, id, imageUrl, units }, index) => (
                                <tr key={id ?? index}>
                                    <td className={styles.imgContainer}>
                                        {imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                width={50}
                                                height={50}
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
                                            value={units ?? 1} // Si `units` es undefined, usa `1`
                                            onChange={(e) => {
                                                const newQuantity = Number(e.target.value);
                                                if (id) updateProductQuantity(id, newQuantity);
                                            }}
                                            min="1"
                                            max="99"  // Limitar cantidad máxima si es necesario
                                            className={styles.quantityInput}
                                        />
                                    </td>
                                    <td className="text-green-600">{formatPrice(Number(price) * (units ?? 1))}</td>
                                    <td>
                                        <button
                                            className={styles.cartButton}
                                            onClick={() => id && deleteProduct(id)}
                                        >
                                            X
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className={styles.emptyCartMessage}>
                                    No hay productos en el carrito
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <CheckoutComponent totalCart={totalCart} handleOrder={handleOrder} 
                shippingAddress={defaultAddress}
                loading={loading1}// Pasar la dirección predeterminada directamente
            />
        </div>
    );
};

export default CartComponent;
