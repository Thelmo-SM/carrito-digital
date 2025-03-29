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
    id: string
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }
  export interface Review {
    userId: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }
  
  // export interface ProductOrder {
  //   id: string;
  //   total: number;
  //   status: string;
  //   createdAt: Date;
  //   products: ProductOrderTypes[]; // Aquí debería ir la estructura de cada producto.
  //   shipping: []; // O puedes poner una estructura más definida si lo sabes.
  // }
  export interface ProductOrder {
    id: string;
    total: number;
    status: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    address: ShippingAddress;
    reviews: Review[]; // Agregar esta propiedad para las reseñas
  }