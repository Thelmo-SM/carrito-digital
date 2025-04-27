"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
//import { getTopRatedProducts } from "@/utils/firebase";
import { getTopRatedProducts } from "../services/productsServices";
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
import { useCart } from "@/store/ProductCartContext";
import { IsAuthenticated } from "@/components/UI/Message";
import ModalForm from "@/components/Modals/modalForm";
import { useModalForm } from "@/hooks/useModalForm";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";

export const ProductsComponent = () => {
  const [itemData, setItemData] = useState<productsTypes[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortType, setSortType] = useState<string>("latest");
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleProducts, setVisibleProducts] = useState<productsTypes[]>([]);
  const [addedProducts, setAddedProducts] = useState<{ [key: string]: boolean }>({});

  const [currentPage, setCurrentPage] = useState(1);
  const { cart, handleAddToCard, updateProductQuantity } = useCart();
  const { isOpen, openModal, closeModal } = useModalForm();
    const user = useAuthUsers();
  const quantity: number = 1; 

  // Obtener productos
  const productsPerPage = 8;

  const getItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await getTopRatedProducts()) as productsTypes[];
      if (data) {
        setItemData(data);
      }
    } catch (error) {
      console.error("Error al leer productos: ", error);
    } finally {
      setLoading(false);  // Establecer como false después de obtener los productos
    }
  }, []);

  useEffect(() => {
    getItems();
  }, [getItems]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    const newProducts = itemData.slice(startIndex, endIndex);

    setVisibleProducts((prevProducts) => {
      if (currentPage === 1) {
        return newProducts;
      } else {
        return [...prevProducts, ...newProducts];
      }
    });
  }, [currentPage, itemData]);

  const loadMoreProducts = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

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
    let products = [...visibleProducts];

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
      products.sort((a, b) => {
        const reviewsA = a.reviews?.length || 0;
        const reviewsB = b.reviews?.length || 0;
        return reviewsB - reviewsA;
      });
    }

    return products;
  }, [visibleProducts, selectedCategory, searchQuery, sortType]);

  const handleSortChange = (value: string) => {
    if (value === "default") {
      setSortType("latest");
    } else {
      setSortType(value);
    }
  };

  const handleAddProduct = (product: productsTypes) => {
    if (!user) {
      // Si no está autenticado, abrir el modal
      openModal();
      return; // Evitar agregar el producto al carrito
    }


    const { id, name, soldUnits, price, imageUrl } = product;
  
    const existingProduct = cart.find(item => item.id === id);
  
    if (existingProduct) {
      // Si el producto ya está en el carrito, actualizamos la cantidad
      updateProductQuantity(id, (existingProduct.units ?? 0) + quantity);  // Asegurarse de sumar correctamente la cantidad
    } else {
      // Si el producto no está en el carrito, lo agregamos con la cantidad seleccionada
      handleAddToCard(
        {
          name,
          soldUnits,
          price,
          imageUrl,
          id: id, // Usar el id como número o string según corresponda
        },
        quantity // Pasamos la cantidad seleccionada por el usuario
      );
    }

        // Establecer estado de producto agregado
        setAddedProducts((prevState) => ({
          ...prevState,
          [product.id]: true,  // Asumiendo que 'id' es el identificador único del producto
        }));

        // Reiniciar estado después de 3 segundos
        setTimeout(() => {
          setAddedProducts((prevState) => ({
            ...prevState,
            [product.id]: false,  // Asumiendo que 'id' es el identificador único del producto
          }));
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
        ) : filteredProducts.length > 0 ? (
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
              <button 
                     onClick={() => handleAddProduct(product)} // Pasamos el producto completo
                      className={`${addedProducts[product.id] ? Style.añadidoButon: Style.button}`}
                    >
                {addedProducts[product.id] ? '✔' : 'AÑADIR AL CARRITO'}
                </button>
            </div>
          ))
        ) : (
          <p className={Style.loading}>No hay productos disponibles.</p>
        )}
      </div>
  
      <div className={Style.loadMoreButtonContainer}>
        {filteredProducts.length > 0 ? (
          <button onClick={loadMoreProducts} className={Style.loadMoreButton}>
            Cargar más
          </button>
        ) : ''}
      </div>

      <ModalForm isOpens={isOpen} closeModal={closeModal}>
            
            <IsAuthenticated />
            
      </ModalForm>
    </section>
  );
};

export default ProductsComponent;
