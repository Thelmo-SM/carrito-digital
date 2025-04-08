import style from '@/styles/Loader.module.css';


export default function Loading() {
    return (
        <div className={style.globalLoading}>
        <div className={style.Loading} >*
        </div>
        <h2>Por favor espere</h2>
        </div>
    );
};
