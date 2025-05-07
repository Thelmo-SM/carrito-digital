import { FieldValue, Timestamp } from "firebase/firestore";
import { Review } from "./ordersTypes";

export interface itemImage {
    path: string;
    url: string;
  }
  
  export interface productsTypes {
    id: string;
    file?: itemImage[];  // Cambio aquí, ahora es un arreglo de imágenes
    imageUrl?: string;
    name: string;
    price: number;
    soldUnits: number;
    categorie: string[];
    description: string;
    isFeature?: boolean;
    createdAt?: FieldValue;
    avgRating?: number;
    reviews?: Review[];
    units?: number;
  }

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
    id: string;
    name: string;
    description: string;
    price: number;
    soldUnits: number;
    imageUrl: string;
    reviews: Review[];
  }
  

export interface productTypeContext {
    cart: cartTypes[]; 
    setCart: (cart: cartTypes[]) => void;
    handleAddToCard: (product: cartTypes, quantity: number) => void; 
    deleteProduct: (id: string) => void;
    updateProductQuantity: (id: string, newQuantity: number) => void
    successMessage: boolean;
    totalItems: number;
}