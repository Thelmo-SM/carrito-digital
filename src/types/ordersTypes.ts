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
  
  export interface ProductOrder {
    id: string;           // ID del producto en la orden
    name: string;         // Nombre del producto
    description: string;  // Descripción del producto (si la tienes)
    price: number;        // Precio del producto
    total: number;        // Total de la orden (puede ser el total de todos los productos)
    status: string;       // Estado de la orden (por ejemplo, "pendiente", "enviado")
    createdAt: Date;      // Fecha de creación de la orden
    products: ProductOrderTypes[];  // Lista de productos ordenados
    shipping: [];      // Detalles de envío
    reviews: Review[];    // Reseñas de este producto
  };