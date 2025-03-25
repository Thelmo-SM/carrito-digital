'use client';

import styles from '@/styles/cart.module.css'; // Asegúrate de que la ruta sea correcta
import { useCart } from '@/store/ProductCartContext';
import { useAuthUsers } from '@/features/Auth/hooks/authUsers';
import { useState } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/features/Dashboard/helpers/formatPrice';
import ModalForm from '@/components/Modals/modalForm';
import { useModalForm } from '@/hooks/useModalForm';
import CheckoutComponent from '../../../features/Checkout/CheckoutComponent';
import { createOrder } from '@/utils/firebase';
import AddressFormComponent from '../../../features/Checkout/AddressFormComponent';


export const CartComponent = () => {
    const user = useAuthUsers();
    const { cart, deleteProduct, updateProductQuantity } = useCart();
    const [isAddressFormVisible, setAddressFormVisible] = useState(false);
    const [shippingAddress, setShippingAddress] = useState(null);
    const {isOpen, openModal, closeModal} = useModalForm();

    const handleOrder = async () => {
        // if (!user?.uid) {
        //   alert("Por favor, inicie sesión para realizar un pedido.");
        //   return;
        // }
      
        // if (cart.length === 0) {
        //   alert("El carrito está vacío.");
        //   return;
        // }
      
        // const productIds = cart
        //   .map(item => item.id)
        //   .filter(id => id !== null);
      
        // if (productIds.length === 0) {
        //   alert("No hay productos válidos en el carrito.");
        //   return;
        // }
      
        // // Verificar el valor de shippingAddress
        // console.log("Dirección de envío:", shippingAddress);
      
        // if (!shippingAddress) {
        //   alert("Por favor, ingrese una dirección de envío válida.");
        //   return;
        // }
      
        // try {
        //   const orderId = await createOrder(user.uid, productIds, totalCart, shippingAddress);
        //   alert(`Pedido realizado exitosamente. ID de pedido: ${orderId}`);
        // } catch (error) {
        //   alert("Hubo un problema al procesar el pedido.");
        //   console.log(error)
        // }

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
        if (!shippingAddress) {
            alert("Por favor, ingrese una dirección de envío válida.");
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
            shippingAddress,
        };
    
        try {
            // Enviar los datos al backend para crear el pedido
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });
    
            const data = await response.json();
            window.location = data.sessionUrl
            console.log(data);
    
            if (response.ok) {
                alert(`Pedido realizado exitosamente. ID de pedido: ${data.orderId}`);
            } else {
                alert("Hubo un problema al procesar el pedido.");
            }
        } catch (error) {
            alert("Error al procesar el pedido.");
            console.error(error);
        }

      };


    const totalCart = cart.reduce((acc, item) => acc + (item.price || 0) * (item.units ?? 1), 0);

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
                            cart.map(({ name, price, id, imageUrl, units }) => (
                                <tr key={id}>
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


            {isAddressFormVisible && (
            <ModalForm isOpens={isOpen} closeModal={closeModal}>
                <AddressFormComponent onAddressSaved={(address) => {
                    setShippingAddress(address);
                    setAddressFormVisible(false);
                }} />
                </ModalForm>
            )}

            <CheckoutComponent totalCart={totalCart} handleOrder={handleOrder} openModal={openModal} 
            setAddressFormVisible={setAddressFormVisible}
            shippingAddress={shippingAddress}
            isAddressFormVisible={isAddressFormVisible}
            />
        </div>
    );
};

export default CartComponent;