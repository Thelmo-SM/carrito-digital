"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";

import { getTopRatedProducts } from "../services/productsServices";
import { productsTypes } from "@/types/productTypes";
import { formatPrice } from "@/features/Dashboard/helpers/formatPrice";

import Style from "@/styles/products.module.css";
import searchStyle from "@/styles/search.module.css";

import { SearchFilter } from "./Filters/SearchFilter";
import { SortFilter } from "./Filters/SortFilter";
import { CategoryFilter } from "./Filters/CategoryFilter";
import { LoaderUi } from "@/components/UI/LoaderUi";
import { useCart } from "@/store/ProductCartContext";
import { IsAuthenticated } from "@/components/UI/Message";
import ModalForm from "@/components/Modals/modalForm";
import { useModalForm } from "@/hooks/useModalForm";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";

export const ProductsComponent = () => {
  const [itemData, setItemData] = useState<productsTypes[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [loading, setLoading] = useState(false);
  const [addedProducts, setAddedProducts] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;
  const user = useAuthUsers();
  const { cart, handleAddToCard, updateProductQuantity } = useCart();
  const { isOpen, openModal, closeModal } = useModalForm();
  const quantity = 1;

  const getItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTopRatedProducts();
      if (data) {
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

  const filteredProducts = useMemo(() => {
    let products = [...itemData];

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

    switch (sortType) {
      case "low-high":
        products.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "high-low":
        products.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "latest":
        products.sort((a, b) => {
          const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate().getTime() : 0;
          const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate().getTime() : 0;
          return dateB - dateA;
        });
        break;
      case "popularity":
        products.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0));
        break;
    }

    return products;
  }, [itemData, selectedCategory, searchQuery, sortType]);

  const paginatedProducts = useMemo(() => {
    const endIndex = currentPage * productsPerPage;
    return filteredProducts.slice(0, endIndex);
  }, [filteredProducts, currentPage]);

  const loadMoreProducts = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleSortChange = (value: string) => {
    setSortType(value === "default" ? "latest" : value);
  };

  const handleAddProduct = (product: productsTypes) => {
    if (!user) {
      openModal();
      return;
    }

    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      updateProductQuantity(product.id, (existingProduct.units ?? 0) + quantity);
    } else {
      handleAddToCard(
        {
          name: product.name,
          soldUnits: product.soldUnits,
          price: product.price,
          imageUrl: product.imageUrl,
          id: product.id,
        },
        quantity
      );
    }

    setAddedProducts((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedProducts((prev) => ({ ...prev, [product.id]: false }));
    }, 3000);
  };

  return (
    <section>
      <div className={searchStyle.inicioContainer}>
        <h1 className={searchStyle.saludo}>Todos los productos</h1>

        <SearchFilter onSearch={setSearchQuery} />

        <div className={searchStyle.categories}>
          <SortFilter sortType={sortType} onSortChange={handleSortChange} />
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>

      <div className={Style.container}>
        {loading ? (
          <div className={Style.loading}>
            <LoaderUi />
            <p>Cargando productos...</p>
          </div>
        ) : paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
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
                Cantidad - <span className={Style.span}>{product.soldUnits}</span>
              </p>
              <p className={Style.price}>{formatPrice(Number(product.price))}</p>
              <p>
                Reseñas:{" "}
                <span className={Style.span}>★ {product.reviews?.length || 0}</span>
              </p>
              <Link href={`/products/${product.id}`} className={Style.detalle}>
                Ver detalles
              </Link>
              <button
                onClick={() => handleAddProduct(product)}
                className={addedProducts[product.id] ? Style.añadidoButon : Style.button}
              >
                {addedProducts[product.id] ? "✔" : "AÑADIR AL CARRITO"}
              </button>
            </div>
          ))
        ) : (
          <p className={Style.loading}>No hay productos disponibles.</p>
        )}
      </div>

      <div className={Style.loadMoreButtonContainer}>
        {filteredProducts.length > paginatedProducts.length && (
          <button onClick={loadMoreProducts} className={Style.loadMoreButton}>
            Cargar más
          </button>
        )}
      </div>

      <ModalForm isOpens={isOpen} closeModal={closeModal}>
        <IsAuthenticated />
      </ModalForm>
    </section>
  );
};

export default ProductsComponent;
