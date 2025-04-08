'use client';

import { createContext, useState, useContext, useEffect } from "react";
import {  productTypeContext , cartTypes} from "@/types/productTypes";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";


const ProductCartContext = createContext<productTypeContext>({
    cart: [],
    setCart: () => {},
    handleAddToCard: () => {}, 
    deleteProduct: () => {},
    updateProductQuantity: () => {},
    successMessage: false,
    totalItems: 0,
});

export const ProductCartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<cartTypes[]>([]);
    const [successMessage, setSuccessMessage] = useState(false);
    const user = useAuthUsers();

    useEffect(() => {
        if (cart.length > 0 && user?.uid) {
            localStorage.setItem(`cart_${user?.uid}`, JSON.stringify(cart));
        }
    }, [cart, user?.uid]);

    useEffect(() => {
        if (user?.uid) {
            const persistirCart = localStorage.getItem(`cart_${user.uid}`);
            if (persistirCart) {
                try {
                    const cartData = JSON.parse(persistirCart);
                    if (Array.isArray(cartData)) {
                        setCart(cartData);  // Actualiza solo si los datos son válidos
                    }
                } catch (error) {
                    console.error("Error parsing cart from localStorage:", error);
                    setCart([]);  // En caso de error, vaciar el carrito
                }
            } else {
                setCart([]);  // Si no existe carrito, establecer un carrito vacío
            }
        }
    }, [user?.uid]);
    
    const handleAddToCard = (product: cartTypes, quantity: number) => {
        try {
        if (user?.uid) {
            const existingProduct = cart.find(item => item.id === product.id);
            let updatedCart;

            if (existingProduct) {
                // Incrementar la cantidad
                updatedCart = cart.map(item =>
                    item.id === product.id
                        ? { ...item, units: item.units ?? 0 + quantity }
                        : item
                );
            } else {
                // Agregar el producto con la cantidad seleccionada
                updatedCart = [...cart, { ...product, userId: user?.uid, units: quantity }];
            }

            setCart(updatedCart);
            localStorage.setItem(`cart_${user?.uid}`, JSON.stringify(updatedCart));
        } else {
            console.log('Por favor, inicie sesión para agregar productos al carrito');
        }
    } catch (error: unknown) {
            console.log(error);
    } finally {
        // setSuccessMessage(true);

        // setTimeout(() => {
        //   setSuccessMessage(false);
        // }, 3000);
    }
    };
    console.log(setSuccessMessage)

    const deleteProduct = (id: string) => {
        const updatedCart = cart.filter((product) => product.id !== id.toString());
        setCart(updatedCart);
        if (user?.uid) {
            localStorage.setItem(`cart_${user?.uid}`, JSON.stringify(updatedCart));
        }
    }

    const updateProductQuantity = (id: string, newQuantity: number) => {
        setCart(prevCart =>
          prevCart.map(item =>
            item.id === id ? { ...item, units: newQuantity } : item
          )
        );
      };

      const totalItems = cart.reduce((total, product) => total + (product.units ?? 0), 0);

    return (
        <ProductCartContext.Provider value={{ cart, setCart, handleAddToCard, deleteProduct, updateProductQuantity, successMessage, totalItems }}>
            {children}
        </ProductCartContext.Provider>
    );
};

export const useCart = () => useContext(ProductCartContext);