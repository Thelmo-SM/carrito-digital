import Style from '@/styles/homeCategories.module.css';
import Image from 'next/image';
import todasImg from '../../../public/HomeImg/categoriesButtons/todas.webp';
import ComputadorasImg from '../../../public/HomeImg/categoriesButtons/Computadoras.webp';
import LaptopsImg from '../../../public/HomeImg/categoriesButtons/Laptops.webp';
import TabletsImg from '../../../public/HomeImg/categoriesButtons/Tablets.webp';
import GamingImg from '../../../public/HomeImg/categoriesButtons/Gaming.webp';
import BocinasImg from '../../../public/HomeImg/categoriesButtons/Bocinas.webp';
import OficinaImg from '../../../public/HomeImg/categoriesButtons/Sillas.webp';
import ImagenImg from '../../../public/HomeImg/categoriesButtons/TV.webp';

type FeaturedCategoriesProps = {
  onSelectCategory: (category: string | null) => void;
  selectedCategory: string | null;
};

export const FeaturedCategories = ({ onSelectCategory, selectedCategory }: FeaturedCategoriesProps) => {
  const categories = [
    { name: "Computadoras", image: ComputadorasImg },
    { name: "Laptops", image: LaptopsImg },
    { name: "Tablets", image: TabletsImg },
    { name: "Gaming", image: GamingImg },
    { name: "Bocinas", image: BocinasImg },
    { name: "Oficina", image: OficinaImg },
    { name: "Imagen y Sonido", image: ImagenImg }
  ];

  return (
    <article className={Style.container}>
      <h2>Categorías destacadas</h2>
      <div className={Style.features}>
        <button
          onClick={() => onSelectCategory(null)}
          className={selectedCategory === null ? Style.selectedButton : ""}
        >
          <Image 
            src={todasImg} 
            width={150} 
            height={150} 
            alt="Todas" 
            className={Style.img}
          /> 
          Todas
        </button>

        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onSelectCategory(category.name)}
            className={selectedCategory === category.name ? Style.selectedButton : ""}
          >
            <Image 
              src={category.image} 
              width={150} 
              height={150} 
              alt={category.name} 
              className={Style.img}
            /> 
            {category.name}
          </button>
        ))}
      </div>
    </article>
  );
};

export default FeaturedCategories;
