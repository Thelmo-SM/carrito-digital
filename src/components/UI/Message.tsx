 import style from '@/styles/form.module.css';
 import cartXImg from '../../../public/cart-x.webp';
 import Image from 'next/image';


interface MessageProp {
    children: string;
}

export const MessageErrror = ({children}: MessageProp) => {
    return (
        <div className={style.mesageError}>
                {/* <Image src='' width={100} height={100} alt="" 
                className=""
                /> */}
                <p className="">{children}</p>
            </div>
    );
};

export const ValidateMessgeErrror = ({children}: MessageProp) => {
    return (
        <div className={style.error}>
                {/* <Image src='' width={100} height={100} alt="" 
                className=""
                /> */}
                <p className={style.errorText}>{children}</p>
            </div>
    );
};

export const IsAuthenticated = () => {
    return (
        <div className={style.overlay}>
          <div className={style.modal}>
            <Image src={cartXImg} width={180} height={180} alt='' 
            className={style.imgMessage}
            />
            <h2 className={style.title}>¡Necesitas iniciar sesión!</h2>
            <p className={style.message}>
              Para agregar productos al carrito, primero debes iniciar sesión. Si no tienes una cuenta, por favor regístrate.
            </p>
            <div className={style.buttons}>
              <button className={style.closeButton}
               onClick={() => window.location.href = '/register'}
              >
                Registrarse</button>
              <button className={style.loginButton} 
              onClick={() => window.location.href = '/login'}
              >
                Iniciar sesión</button>
            </div>
          </div>
        </div>
      );
}

