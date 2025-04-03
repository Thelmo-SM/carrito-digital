//import { productsTypes } from "@/types/productTypes";
import { getProductWithReviews } from "@/utils/firebase";  // Importa la función correctamente
import { Metadata } from "next";
import ProductDetailComponent from "@/features/ProductsComponents/ProductsDetailComponents";

type DatilIdProps = {
    params: {
        product: string;
    };
};

export const generateMetadata = async ({ params }: DatilIdProps): Promise<Metadata> => {
    if (!params?.product) {
        return {
            title: "Producto no encontrado",
        };
    }

    const product = await getProductWithReviews(params.product);  // Llamar a la nueva función

    return {
        title: product ? product.name : "Producto no encontrado",
    };
};

export const DetailProduct = async ({ params }: DatilIdProps) => {
    if (!params?.product) {
        return <h1>Error: No se encontró el producto</h1>;
    }

    const product = await getProductWithReviews(params.product);  // Llamar a la nueva función

    if (!product) {
        return <h1>Producto no encontrado</h1>;
    }

    const { name, description, price, soldUnits, imageUrl, id, reviews } = product;  // Obtener también las reseñas

    return (
        <ProductDetailComponent 
            name={name} 
            description={description} 
            price={price} 
            soldUnits={soldUnits} 
            imageUrl={imageUrl} 
            key={id} 
            id={id!} 
            reviews={reviews}  // Pasar las reseñas al componente
        />
    );
};

export default DetailProduct;
