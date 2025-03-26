export interface orderTypes {
    id: string;
    total: number;
    status: string;
    createdAt: number;
    products: { name: string; price: number; quantity: number }[];
}