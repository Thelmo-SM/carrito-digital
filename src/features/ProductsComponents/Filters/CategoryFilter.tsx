import style from '@/styles/search.module.css';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  return (
    <nav className="flex gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`${
            selectedCategory === category
              ? style.selecct
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          aria-label={`Filtrar por ${category}`}
        >
          {category}
        </button>
      ))}
    </nav>
  );
};
