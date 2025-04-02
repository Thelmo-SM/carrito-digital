'use client';

import { useState, useEffect } from "react";
import { getTopRatedProducts } from "@/utils/firebase";  // Asegúrate de importar esta función
import Style from '@/styles/products.module.css';
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/features/Dashboard/helpers/formatPrice";
import { productsTypes } from "@/types/productTypes";
import FeaturedCategories from "./FeaturedCategories";  // Asegúrate de importar el componente FeaturedCategories

export const FeaturedProducts = () => {
    const [products, setProducts] = useState<productsTypes[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
    const onSelectCategory = (category: string | null) => {
      setSelectedCategory(category);
    };
  
    useEffect(() => {
      const fetchTopRatedProducts = async () => {
        const data = await getTopRatedProducts();
        if (selectedCategory) {
          const filteredData = data.filter((product) =>
            product.categorie.includes(selectedCategory) // Verifica si la categoría está en el array
          );
          setProducts(filteredData);
        } else {
          setProducts(data);
        }
      };
  
      fetchTopRatedProducts();
    }, [selectedCategory]);
  
    return (
      <div>
        <FeaturedCategories 
          onSelectCategory={onSelectCategory} 
          selectedCategory={selectedCategory} 
        />
        <div className={Style.container}>
          {products.map((product) => (
            <div key={product.id} className={Style.cardContainer}>
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
              <p className={Style.title1}>{product.name}</p>
              <p className={Style.price}>{formatPrice(Number(product.price))}</p>
              <p>Cantidad - <span className={Style.span}>{product.soldUnits}</span></p>
              <p>Rating: {product.avgRating}</p>
              <Link href={`/products/${product.id}`} className={Style.detalle}>Ver detalles</Link>
              <button className={Style.button}>AÑADIR AL CARRITO</button>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default FeaturedProducts;