// import { formatPrice } from "@/features/Dashboard/helpers/formatPrice";
// //import { productsTypes } from "@/types/productTypes";
// import Style from '@/styles/products.module.css';
// import img from '../../../public/ewfrtew.jpg'
// import Image from "next/image";


// type productComponent = {
//     name: string;
//     price: number;
//     soldUnits: number;
//     description: string;
//     deleteItem: () => void;  // Cambio aquí
// };

// export const ProductsComponent = ({ name, price, soldUnits, description, deleteItem }: productComponent) => {
//     return (
//         <div className={Style.cardContainer}>
//             <Image src={img} width={300} height={200} alt=""/>
//             <p>{name}</p>
//             <p className={Style.price}>{formatPrice(Number(price))}</p>
//             {/* <p>{soldUnits}</p> */}
//             {/* <p>{description}</p> */}
//             <button style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' }}>
//                 Editar
//             </button>
//             <button
//                 onClick={deleteItem} // Corrección aquí
//                 style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' }}
//             >
//                 Eliminar
//             </button>
//         </div>
//     );
// };

// export default ProductsComponent;