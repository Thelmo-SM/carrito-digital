'use client';

import Image from "next/image";
import Style from '@/styles/products.module.css';
import searchStyle from '@/styles/search.module.css';
import { formatPrice } from "@/features/Dashboard/helpers/formatPrice";
import { productsTypes } from "@/types/productTypes";
import { getCollection } from "@/utils/firebase";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";


export const ProductsComponent = () => {
    const [itemData, setItemData] = useState<productsTypes[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
    const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  
    // 🔹 Función optimizada para obtener productos
    const getItems = useCallback(async () => {
      try {
        const data = (await getCollection("products")) as productsTypes[];
        if (data) setItemData(data);
      } catch (error) {
        console.error("Error al leer productos: ", error);
      } finally {
        setLoading(false); // Termina la carga
      }
    }, []);
  
    // 🔹 Efecto optimizado para cargar productos solo una vez
    useEffect(() => {
      getItems();
    }, [getItems]);
  
    // 🔹 Memoización de categorías para evitar recrearlas en cada render
    const categories = useMemo(
      () => [
        "Todos",
        "Computadoras",
        "Laptops",
        "Tablets",
        "Gaming",
        "Bocinas",
        "Almacenamiento",
        "Imagen y Sonido",
        "Oficina",
      ],
      []
    );
  
    // 🔹 Filtrado de productos usando useMemo para evitar cálculos innecesarios
    const filteredProducts = useMemo(() => {
      return selectedCategory === "Todos"
        ? itemData
        : itemData.filter((product) => product.categorie.includes(selectedCategory));
    }, [itemData, selectedCategory]);
  
    // 🔹 Manejador optimizado para cambiar de categoría
    const handleCategoryChange = (category: string) => {
      if (category !== selectedCategory) {
        setSelectedCategory(category);
      }
    };
  
    return (
      <section>
        <div className={searchStyle.inicioContainer}>
          <h1 className={searchStyle.saludo}>Todos los productos</h1>
  
          <div className={searchStyle.searchContainer}>
            <input
              type="search"
              placeholder="Buscar"
              className={searchStyle.search}
            />
            <input type="submit" className={searchStyle.searchButton} />
          </div>
  
          <div className={searchStyle.categories}>
            <select className={searchStyle.filtroContainer}>
              <option value="">Orden por defecto</option>
              <option value="">Ordenar por popularidad</option>
              <option value="">Ordenar por los últimos</option>
              <option value="">Ordenar por precio: bajo a alto</option>
              <option value="">Ordenar por precio: alto a bajo</option>
            </select>
  
            {/* 🔹 Botones de categorías */}
            <nav className={searchStyle.categoryButtons}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-md transition-all ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  aria-label={`Filtrar por ${category}`}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>
        </div>
  
        {/* 🔹 Mostrar indicador de carga mientras los datos se obtienen */}
        {loading ? (
          <p className="text-center text-gray-500">Cargando productos...</p>
        ) : (
          <div className={Style.container}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
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
                  <p className={Style.price}>
                    {formatPrice(Number(product.price))}
                  </p>
                  <p>
                    Cantidad -{" "}
                    <span className={Style.span}>{product.soldUnits}</span>
                  </p>
  
                  <Link href={`/products/${product.id}`} className={Style.detalle}>
                    Ver detalles
                  </Link>
  
                  <button className={Style.button}>AÑADIR AL CARRITO</button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No hay productos en esta categoría
              </p>
            )}
          </div>
        )}
      </section>
    );
  };
  
  export default ProductsComponent;