import { productsTypes } from "@/types/productTypes";
import { getCollection } from "@/utils/firebase";
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

    const product = await fetchDetailProduct(params.product);

    return {
        title: product ? product.name : "Producto no encontrado",
    };
};

export const fetchDetailProduct = async (id: string) => {
    const path = `products`;

    try {
        const data = (await getCollection(path)) as productsTypes[];
        const finData = data.find((p) => p.id === id);
        return finData || null;
    } catch (error) {
        console.error("Error fetching product details:", error);
        return null;
    }
};



export const DetailProduct = async ({ params }: DatilIdProps) => {
    if (!params?.product) {
        return <h1>Error: No se encontró el producto</h1>;
    }

    const product = await fetchDetailProduct(params.product);

    if (!product) {
        return <h1>Producto no encontrado</h1>;
    }

    const { name, description, price, soldUnits, imageUrl, id } = product;

    return (
            <ProductDetailComponent name={name} description={description} price={price} soldUnits={soldUnits} imageUrl={imageUrl} key={id} id={id!} />
    );
};

export default DetailProduct;