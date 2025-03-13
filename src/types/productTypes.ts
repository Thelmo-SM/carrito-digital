import { Timestamp } from "firebase/firestore";

export interface itemImage {
    path: string;
    url: string;
};

export interface productsTypes {
    id?: string;
    //image: itemImage;
    name: string;
    price: number;
    soldUnits: number;
    description: string
    createdAt?: Timestamp;
};