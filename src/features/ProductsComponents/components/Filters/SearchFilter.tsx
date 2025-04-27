import { useState } from "react";
import styles from "@/styles/search.module.css";

interface SearchFilterProps {
  onSearch: (query: string) => void;
}

export const SearchFilter = ({ onSearch }: SearchFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="search"
        placeholder="Buscar producto..."
        value={searchQuery}
        onChange={handleSearch}
        className={styles.search}
      />
      {/* <button type="submit" className={styles.searchButton}>
        🔍
      </button> */}
    </div>
  );
};
