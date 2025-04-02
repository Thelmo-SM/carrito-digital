import Style from '@/styles/homeCategories.module.css';

type FeaturedCategoriesProps = {
  onSelectCategory: (category: string | null) => void;
  selectedCategory: string | null;
};

export const FeaturedCategories = ({ onSelectCategory, selectedCategory }: FeaturedCategoriesProps) => {
  const categories = ["Computadoras", "Laptops", "Tablets", "Gaming", "Bocinas", "Oficina", "Imagen y Sonido"];

  return (
    <article className={Style.container}>
      <h2>Categorías destacadas</h2>
      <div className={Style.features}>
        <button
          onClick={() => onSelectCategory(null)}
          className={selectedCategory === null ? Style.selectedButton : ""}
        >
          Todas
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={selectedCategory === category ? Style.selectedButton : ""}
          >
            {category}
          </button>
        ))}
      </div>
    </article>
  );
};

export default FeaturedCategories;
