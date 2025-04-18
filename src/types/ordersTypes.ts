export interface orderTypes {
    id: string;
    total: number;
    status: string;
    createdAt: Date; // Cambia a Date si quieres usar objetos Date reales
    products: ProductOrderTypes[];
    shippingAddress: ShippingAddress | null;
    client?: string;
  }

export interface ProductOrderTypes {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string; // Asegúrate de que esto esté incluido
    shippingAddress: []
    reviews: Review[];
  }

  export interface ShippingAddress {
    id?: string
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
  }
  export interface Review {
    id: string;
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

  export interface ProductOrderTypes1 {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    reviews: Review[]; // Aquí agregamos las reseñas asociadas al producto
  }
  
  export interface OrderTypes1 {
    id: string;
    total: number;
    status: string;
    createdAt: Date; // Utilizando Date para manejar correctamente las fechas
    products: ProductOrderTypes[]; // Aquí cada producto es un ProductOrderTypes
    shippingAddress: ShippingAddress | null;
  }
  
  export interface ProductOrder1 {
    id: string;
    total: number;
    status: string;
    createdAt: Date;
    products: ProductOrderTypes[]; // Listado de productos dentro de la orden
    shipping: ShippingAddress; // Dirección de envío asociada a la orden
  }