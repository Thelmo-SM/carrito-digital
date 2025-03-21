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
            className={`px-4 py-2 rounded-md transition-all ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
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
  