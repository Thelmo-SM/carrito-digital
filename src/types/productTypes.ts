import { Timestamp } from "firebase/firestore";

export interface itemImage {
    path: string;
    url: string;
};

export interface productsTypes {
    id?: string;
    file?: itemImage;
    imageUrl?: string;
    name: string;
    price: number;
    soldUnits: number;
    categorie: string[];
    description: string;
    isFeature?: boolean;
    createdAt?: Timestamp;
};

export interface cartTypes {
    id: string;
    imageUrl?: string;
    name: string;
    price: number;
    soldUnits?: number;
    units?: number
    description?: string;
    createdAt?: Timestamp;
    userId?: string; 

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
    id: string;
}

export interface productTypeContext {
    cart: cartTypes[]; 
    setCart: (cart: cartTypes[]) => void;
    handleAddToCard: (product: cartTypes) => void;
    deleteProduct: (id: string) => void;
    updateProductQuantity: (id: string, newQuantity: number) => void
}