import { formatPrice } from "@/features/Dashboard/helpers/formatPrice";
import Style from '@/styles/products.module.css';
import Image from "next/image";
import { detailProduct } from "@/types/productTypes";


export const ProductDetailComponent = ({ name, price, soldUnits, description, imageUrl }: detailProduct) => {
    return (
        <div className={Style.dContainer}>
            <div className={Style.subDcontainer1}>
                {imageUrl ? (
                  <Image
                     src={imageUrl}
                     width={600}
                     height={600}
                     alt={name}
                     className={Style.img2}
                   />
                ) : (
                   <p>No hay imagen disponible</p>
                )}
                <p className={Style.pPuntaje}><span className={Style.puntaje}>2,454</span> Reseñas</p>
            </div>

            <div className={Style.subDcontainer2}>
            <p className={Style.title}>{name}</p>
            <p className={Style.description}>{description}</p> 
            <p className={Style.quedan}>Quedan <span className={Style.span}>{soldUnits}</span> disponibles</p>
            <p className={Style.precio}>Precio <span className={Style.price}>{formatPrice(Number(price))}</span></p>
            <div className={Style.compra}>
            <p>Agregar cantidad + 1</p>
            <button>
             AÑADIR AL CARRITO
             </button>
            </div>
            </div>
        </div>
    );
};

export default ProductDetailComponent;