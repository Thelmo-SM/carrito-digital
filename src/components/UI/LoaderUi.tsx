import style from '@/styles/Loader.module.css';
import Style from '@/styles/products.module.css';

type mesagge = {
    children: string
}

export const LoaderUi = () => {
    return (
        <div className={style.loader} >*
        </div>
    );
};

export const LoaderStatusd = ({children}: mesagge) => {
    return (
        <div className={Style.loading}>
        <LoaderUi />
        <p>{children}</p>
      </div>
    );
};

