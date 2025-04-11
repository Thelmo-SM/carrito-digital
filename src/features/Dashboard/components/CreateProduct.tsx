import { useCreateItems } from "../hooks/useCreateItems";
import { productsTypes } from "@/types/productTypes";
import Style from '@/styles/producForm.module.css'
import Image from "next/image";

const initialProductsValues: productsTypes = {
  file: { path: '', url: '' },
  name: '',
  price: 0,
  soldUnits: 0,
  categorie: [],
  description: ''
}

type CreateProductProps = {
  getProduct: () => Promise<void>;
};

export const CreateProduct = ({ getProduct }: CreateProductProps) => {

  const {
    form,
    imagePreview,
    handleChange,
    handleSubmit,
    handleFileChange,
    handleCategoryChange,
    handleCategoryRemove
  } = useCreateItems(initialProductsValues, getProduct);

  const categories = [
    "Computadoras",
    "Laptops",
    "Tablets",
    "Gaming",
    "Bocinas",
    "Almacenamiento",
    "Imagen y Sonido",
    "Oficina",
    'TV',
  ];

  return (
    <div className={Style.container}>
      <form onSubmit={(e) => handleSubmit(e, form)} className={Style.formContainer}>
        <h2>Crear productos</h2>
        <div>
          <label htmlFor="file_id">Imagen</label>
          <input
            className={Style.image}
            type="file"
            id="file_id"
            onChange={handleFileChange}
          />
                    {imagePreview && (
            <Image src={imagePreview} width={100} height={100} alt="Vista previa" className={Style.imagePreview} />
          )}
        </div>
        <div>
          <label htmlFor="name_id">Nombre del producto</label>
          <input
            type="text"
            id="name_id"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="price_id">Precio</label>
          <input
            type="number"
            name="price"
            id="price_id"
            value={form.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="soldUnits_id">Cantidad</label>
          <input
            type="number"
            name="soldUnits"
            id="soldUnits_id"
            value={form.soldUnits}
            onChange={handleChange}
          />
        </div>
        <div>
         <label htmlFor="categorie_id">Categoría</label>
          <select
            multiple
           id="categorie_id"
           name="categorie"
            value={form.categorie} 
           onChange={handleCategoryChange}
            className={Style.input}

          >
           {categories.map((category) => (
             <option key={category} value={category}
             className={Style.option}
             >
               {category}
             </option>
           ))}
         </select>

  {form.categorie.length > 0 && (
    <div className={Style.selectedCategories}>
      <p>Categorías seleccionadas:</p>
      <ul>
        {form.categorie.map((cat, idx) => (
          <li key={idx} className={Style.categoryItem}>
            {cat} 
            <button
              type="button"
              onClick={() => handleCategoryRemove(cat)}
              className={Style.removeCategory}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>


        <div>
          <label htmlFor="description_id">Descripción</label>
          <textarea
            name="description"
            id="description_id"
            value={form.description}
            onChange={handleChange}
            className={Style.textarea}
          ></textarea>
        </div>
        <button type="submit">Crear</button>
      </form>
    </div>
  );
};

export default CreateProduct;
