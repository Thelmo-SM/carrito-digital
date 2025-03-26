export interface orderTypes {
    id: string;
    total: number;
    status: string;
    createdAt: Date; // Cambia a Date si quieres usar objetos Date reales
    products: ProductOrderTypes[];
    shippingAddress: ShippingAddress | null;
  }

export interface ProductOrderTypes {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string; // Asegúrate de que esto esté incluido
    shippingAddress: []
  }

  export interface ShippingAddress {
    id?: string
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }