'use client';

import { useLogin } from "../../hooks/formLogin";
import { validateLogin } from "../../helpers/validateForm";
import { initialLogin } from "../../helpers/initialForm";
import Image from "next/image";
import img from '../../../../../public/login.webp'
import Link from "next/link";
import Style from '@/styles/form.module.css';
import { LoaderUi } from "@/components/UI/LoaderUi";
import { MessageErrror } from "@/components/UI";

export const LoginComponent = () => {
  const {
    form,
    errors,
    loading,
    success,
    errorMessage,
    handleBlur,
    handleChange,
    handleSubmit
  } = useLogin(initialLogin, validateLogin)
    return (
      <div className={Style.container}>
        <form onSubmit={handleSubmit}
        className={Style.formContainer}
        >
        <h2 className={Style.title}>Iniciar Sesión</h2>
        {errorMessage && 
            <MessageErrror>{errorMessage}</MessageErrror>}
          <div>
            <label htmlFor="email">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {errors.email && <div className={Style.error}>
              <p className={Style.errorText}>{errors.email}</p>
              </div>}
          </div>
    
          <div>
            <label htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {errors.password && <div className={Style.error}>
              <p className={Style.errorText}>{errors.password}</p>
              </div>}
          </div>
    
          <button
            type="submit"
            className={`${success ? Style.buttonSuccess : Style.button}`}
            >
          {loading ? <div>
            <LoaderUi/>
            </div> : success ? '✔': 'Iniciar sesión'}
          </button>
          <Link href='/register'
          className={Style.Link}
          >¿No tienes cuenta?</Link>
        </form>
        <div className={Style.image}>
          <Image src={img} width={440} height={100} alt=""
          
          />
        </div>
        </div>
      );
}

export default LoginComponent;