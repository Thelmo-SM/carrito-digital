import Style from '@/styles/homeCategories.module.css';

export const FeaturedCategories = () => {

    return (
        <article className={Style.container}>
        <h2>Categorias detacadas</h2>

        <div className={Style.features}>
            <button>Computadoras</button>
            <button>Laptops</button>
            <button>Tablets</button>
            <button>Gaming</button>
            <button>Bocinas</button>
            <button>Oficina</button>
        </div>
        </article>
    )

}

export default FeaturedCategories;