'use client';

import { useRegister } from "../../hooks/formRegister";
import { initialRegister } from "../../helpers/initialForm";
import { validateRegister } from "../../helpers/validateForm";
import Style from '@/styles/form.module.css';
import Image from "next/image";
import img from '../../../../../public/Asus-Gaming-Weeks.jpg'
import Link from "next/link";

export const RegisterComponent = () => {
  const {
    form,
    errors,
    handleChange,
    handleSubmit,
    handleBlur
  } = useRegister(initialRegister, validateRegister)

    return (
      <div className={Style.container}>
        <div>
          <Image src={img} width={600} height={600} alt=""/>
        </div>
        <form onSubmit={handleSubmit}
        className={Style.formContainer}
        >
          <h2 className={Style.title}>¡Registrate!</h2>
          <div>
            <label htmlFor="name" >
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {errors.name && <div className={Style.error}>
              <p className={Style.errorText}>{errors.name}</p>
              </div>}
          </div>
    
          <div>
            <label htmlFor="lastName" >
              Apellido
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {errors.lastName && <div  className={Style.error}>
              <p className={Style.errorText}>{errors.lastName}</p>
              </div>}
          </div>
    
          <div>
            <label htmlFor="email" >
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
            <label htmlFor="password" >
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
    
          <div>
            <label htmlFor="confirmPassword" >
              Repetir Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {errors.confirmPassword && <div className={Style.error}>
              <p className={Style.errorText}>{errors.confirmPassword}</p>
              </div>}
          </div>
    
          <button
            type="submit"
          >
            Registrarse
          </button>
          <Link href='/login'
          className={Style.Link}
          >¿Ya tienes cuenta?</Link>
        </form>
        </div>
      );
};

export default RegisterComponent;