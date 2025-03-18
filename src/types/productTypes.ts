import { Timestamp } from "firebase/firestore";

export interface itemImage {
    path: string;
    url: string;
};

export interface productsTypes {
    id?: string;
    file: itemImage;
    imageUrl?: string;
    name: string;
    price: number;
    soldUnits: number;
    description: string
    createdAt?: Timestamp;
};

export interface uptatedProductsTypes {
    file: itemImage;
    imageUrl?: string;
    name: string;
    price: number;
    soldUnits: number;
    description: string
};

export interface detailProduct {
    imageUrl?: string;
    name: string;
    price: number;
    soldUnits: number;
    description: string;
}

export interface productTypeContext {
    cart: productsTypes[]; 
    setCart: (cart: productsTypes[]) => void;
    handleAddToCard: (product: productsTypes) => void;
    deleteProduct: (id: number) => void;
}