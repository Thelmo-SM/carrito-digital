import styles from "@/styles/search.module.css";

interface SortFilterProps {
  onSortChange: (sortType: string) => void;
  sortType: string;  // Aseguramos que el valor de sortType se pase correctamente
}

export const SortFilter = ({ onSortChange, sortType }: SortFilterProps) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onSortChange(value);
  };

  return (
    <select
      className={styles.filtroContainer}
      value={sortType}  // Usamos el valor actual de sortType
      onChange={handleSortChange}
    >
      <option value="default">Orden por defecto</option>
      <option value="popularity">Ordenar por popularidad</option>
      {/* <option value="latest">Ordenar por los últimos</option> */}
      <option value="low-high">Ordenar por precio: bajo a alto</option>
      <option value="high-low">Ordenar por precio: alto a bajo</option>
    </select>
  );
};
