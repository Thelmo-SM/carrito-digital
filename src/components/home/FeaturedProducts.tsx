import Image from "next/image";
import Style from '@/styles/products.module.css';
import { formatPrice } from "@/features/Dashboard/helpers/formatPrice";
import { productsTypes } from "@/types/productTypes";
import { getCollection } from "@/utils/firebase";
import { useState, useEffect } from "react";
import Link from "next/link";


export const FeaturedProducts = () => {
      const [itemData, setItemData] = useState<productsTypes[]>([]);

      const getItems = async () => {
          const path = `products`; // Cambiado para acceder a la colección general de productos.
      
          try {
              const data = await getCollection(path) as productsTypes[];
              if (data) {
                  setItemData(data);
              }
              console.log('Productos agregados: ', data);
          } catch (error: unknown) {
              console.log('Error al leer productos: ', error);
          }
      };

      useEffect(() => {
        getItems();
      }, []);
      


    return (
        <div className={Style.container}>
            {itemData.map((product) => (
  <div key={product.id} className={Style.cardContainer}>
    
    {/* Asegúrate de que `product.image` sea la URL de la imagen */}
    {product.imageUrl ? (
   <Image
      src={product.imageUrl}
      width={150}
      height={100}
      alt={product.name}
      className={Style.img}
   />
) : (
   <p>No hay imagen disponible</p>
)}
    
    {/* Mostrar el nombre del producto */}
    <p className={Style.title1}>{product.name}</p>
    
    {/* Formatear el precio, asegurándote de que `product.price` es un número */}
    <p className={Style.price}>{formatPrice(Number(product.price))}</p>
    <p>Cantidad - <span className={Style.span}>{product.soldUnits}</span></p>

    {/* Opcionalmente mostrar la cantidad vendida y la descripción */}
    {/* <p>{product.description}</p> */}
    <Link href = {`/products/${product.id}`} className={Style.detalle}>Ver detalles</Link>

    {/* Botón para eliminar */}
    <button className={Style.button}>
        AÑADIR AL CARRITO
    </button>
  </div>
))}
            </div>
    );
};

export default FeaturedProducts;