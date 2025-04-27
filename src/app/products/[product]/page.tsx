import { Metadata } from "next";
import { getProductWithReviews } from "@/features/ProductsComponents/services/productWithReviewsServices";
import ProductDetailComponent from "@/features/ProductsComponents/components/ProductsDetailComponents";
import { PageProps } from "../../../../.next/types/app/page";  // Asegúrate de que PageProps esté correctamente importado

type DatilIdProps = PageProps & {
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

    const product = await getProductWithReviews(params.product);

    return {
        title: product ? product.name : "Producto no encontrado",
    };
};

// En Next.js, debes asegurarte de que el componente Page sea síncrono
const DetailProduct = async ({ params }: DatilIdProps) => {
    if (!params?.product) {
        return <h1>Error: No se encontró el producto</h1>;
    }

    const product = await getProductWithReviews(params.product);

    if (!product) {
        return <h1>Producto no encontrado</h1>;
    }

    const { name, description, price, soldUnits, imageUrl, id, reviews } = product;

    return (
        <ProductDetailComponent 
            name={name} 
            description={description} 
            price={price} 
            soldUnits={soldUnits} 
            imageUrl={imageUrl} 
            id={id!} 
            reviews={reviews} 
        />
    );
};

export default DetailProduct;
