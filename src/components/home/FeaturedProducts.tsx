'use client';

import { useState, useEffect, useCallback } from "react";
import { getTopRatedProducts } from "@/utils/firebase";
import Style from '@/styles/products.module.css';
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/features/Dashboard/helpers/formatPrice";
import { productsTypes } from "@/types/productTypes";
import FeaturedCategories from "./FeaturedCategories";
import { LoaderUi } from "../UI/LoaderUi";

export const FeaturedProducts = () => {
  const [products, setProducts] = useState<productsTypes[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleProducts, setVisibleProducts] = useState<productsTypes[]>([]);  
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); 

  const productsPerPage = 8;

  const onSelectCategory = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1); 
  };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const data = await getTopRatedProducts();
    if (selectedCategory) {
      const filteredData = data.filter((product) =>
        product.categorie.includes(selectedCategory) 
      );
      setProducts(filteredData);
    } else {
      setProducts(data);
    }
    setLoading(false);
  }, [selectedCategory]);

  const loadMoreProducts = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    setVisibleProducts((prevProducts) => [
      ...prevProducts,
      ...products.slice(startIndex, endIndex),
    ]);
  }, [currentPage, products]);

  return (
    <div className={Style.article}>
      <FeaturedCategories 
        onSelectCategory={onSelectCategory} 
        selectedCategory={selectedCategory} 
      />
      <div className={Style.container}>
        {visibleProducts.map((product) => (
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
      
      {/* Mostrar el botón de cargar más productos */}
      <div className={Style.loadMoreButtonContainer}>
        {loading ? (
          <div className={Style.loading}>
            <LoaderUi />
            <p>Cargando productos...</p>
          </div>
        ) : (
          <button onClick={loadMoreProducts} className={Style.loadMoreButton}>
           Cargar más
          </button>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;
