"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getTopRatedProducts } from "@/utils/firebase";
import { productsTypes } from "@/types/productTypes";
import { formatPrice } from "@/features/Dashboard/helpers/formatPrice";
import Image from "next/image";
import Link from "next/link";
import Style from "@/styles/products.module.css";
import searchStyle from "@/styles/search.module.css";
import { SearchFilter } from "./Filters/SearchFilter";
import { SortFilter } from "./Filters/SortFilter";
import { CategoryFilter } from "./Filters/CategoryFilter";
import { LoaderUi } from "@/components/UI/LoaderUi";

export const ProductsComponent = () => {
  const [itemData, setItemData] = useState<productsTypes[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortType, setSortType] = useState<string>("latest"); // Por defecto ordena por más reciente
  const [loading, setLoading] = useState<boolean>(false);

  // Obtener productos
  const getItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await getTopRatedProducts()) as productsTypes[];
      if (data) {
        console.log("Productos obtenidos:", data); // 🔹 Verificar datos
        setItemData(data);
      }
    } catch (error) {
      console.error("Error al leer productos: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getItems();
  }, [getItems]);

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

  // 🔹 Filtrar por categoría y búsqueda
  const filteredProducts = useMemo(() => {
    let products = [...itemData]; // Copia del array para evitar mutaciones

    if (selectedCategory !== "Todos") {
      products = products.filter((product) =>
        product.categorie.includes(selectedCategory)
      );
    }

    if (searchQuery) {
      products = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 🔹 Ordenamiento según el tipo seleccionado
    if (sortType === "low-high") {
      products.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortType === "high-low") {
      products.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortType === "latest") {
      products.sort((a, b) => {
        const dateA = a.createdAt ? a.createdAt.toDate().getTime() : 0;
        const dateB = b.createdAt ? b.createdAt.toDate().getTime() : 0;
        return dateB - dateA;
      });
    } else if (sortType === "popularity") {
      // Ordenar por popularidad: por cantidad de reseñas
      products.sort((a, b) => {
        const reviewsA = a.reviews?.length || 0; // Si no hay reseñas, tomar 0
        const reviewsB = b.reviews?.length || 0; // Lo mismo para el otro producto
        return reviewsB - reviewsA; // De mayor a menor número de reseñas
      });
    }

    return products;
  }, [itemData, selectedCategory, searchQuery, sortType]);

  // 🔹 Manejador del cambio de orden
  const handleSortChange = (value: string) => {
    if (value === "default") {
      setSortType("latest"); // Asegurar que no quede sin orden
    } else {
      setSortType(value);
    }
  };

  return (
    <section>
      <div className={searchStyle.inicioContainer}>
        <h1 className={searchStyle.saludo}>Todos los productos</h1>

        {/* Filtro de Búsqueda */}
        <SearchFilter onSearch={setSearchQuery} />

        <div className={searchStyle.categories}>
          {/* Filtro de Ordenamiento */}
          <SortFilter sortType={sortType} onSortChange={handleSortChange} />

          {/* Filtro de Categorías */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory} // Pasamos la función para actualizar la categoría seleccionada
          />
        </div>
      </div>

      {loading ? (
        <div className={Style.loading}>
          <LoaderUi />
          <p>Cargando productos...</p>
        </div>
      ) : (
        <div className={Style.container}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className={Style.cardContainer}>
                <Image
                  src={product.imageUrl ?? ""}
                  width={150}
                  height={100}
                  alt={product.name}
                  className={Style.img}
                />
                <p className={Style.title1}>{product.name}</p>
                <p>
                  Cantidad -{" "}
                  <span className={Style.span}>{product.soldUnits}</span>
                </p>
                <p className={Style.price}>
                  {formatPrice(Number(product.price))}
                </p>
                <p>
                  Reseñas:{" "}
                  <span className={Style.span}>
                    ★ {product.reviews?.length || 0}
                  </span>
                </p>
                <Link href={`/products/${product.id}`} className={Style.detalle}>
                  Ver detalles
                </Link>
                <button className={Style.button}>AÑADIR AL CARRITO</button>
              </div>
            ))
          ) : (
            <p className={Style.loading}>No hay productos en esta categoría</p>
          )}
        </div>
      )}
    </section>
  );
};

export default ProductsComponent;
