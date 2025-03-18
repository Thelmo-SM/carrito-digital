'use client';

import { createContext, useState, useContext, useEffect } from "react";
//import { CartTypeContext, CartDetalleProps } from "@/types/products";
import { productsTypes, productTypeContext } from "@/types/productTypes";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import { useRouter } from 'next/navigation';
//import { useModal } from "./modalProvider";

const ProductCartContext = createContext<productTypeContext>({
    cart: [],
    setCart: () => {},
    handleAddToCard: () => {},
    deleteProduct: () => {},
});

export const ProductCartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<productsTypes[]>([]);
    const user = useAuthUsers();
    //const { isOpen, openModal, closeModal } = useModal();
    const router = useRouter();
    

    useEffect(() => {
        if (cart.length > 0 && user?.uid) {
            localStorage.setItem(`cart_${user?.uid}`, JSON.stringify(cart));
        }
    }, [cart, user?.uid]);

    useEffect(() => {
        if (user?.uid) {
            const persistirCart = localStorage.getItem(`cart_${user?.uid}`);
            if (persistirCart) {
                try {
                    setCart(JSON.parse(persistirCart));
                } catch (error) {
                    console.error("Error parsing cart from localStorage:", error);
                    setCart([]);
                }
            } else {
                setCart([]);
            }
        } else {
            setCart([]);
        }
    }, [user?.uid]);

    const handleAddToCard = (product: productsTypes) => {
        if (user?.uid) {
            const userProduct = { ...product, userId: user?.uid };
            const updatedCart = [...cart, userProduct];
            setCart(updatedCart);
            localStorage.setItem(`cart_${user?.uid}`, JSON.stringify(updatedCart));
           // openModal();
            // setTimeout(closeModal, 2050);
            // setTimeout(() => router.push('/products'), 2000);
        } else {
          //  openModal();
            setTimeout(() => router.push('/login'), 2000);
        }
    }

    const deleteProduct = (id: number) => {
        const updatedCart = cart.filter((product) => product.id !== id.toString());
        setCart(updatedCart);
        if (user?.uid) {
            localStorage.setItem(`cart_${user?.uid}`, JSON.stringify(updatedCart));
        }
    }

    return (
        <ProductCartContext.Provider value={{ cart, setCart, handleAddToCard, deleteProduct }}>
            {children}
        </ProductCartContext.Provider>
    );
};

export const useCart = () => useContext(ProductCartContext);