'use client';

import { useLogin } from "../../hooks/formLogin";
import { validateLogin } from "../../helpers/validateForm";
import { initialLogin } from "../../helpers/initialForm";

export const LoginComponent = () => {
  const {
    form,
    errors,
    handleBlur,
    handleChange,
    handleSubmit
  } = useLogin(initialLogin, validateLogin)
    return (
        <form style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" style={{ display: 'block', fontWeight: 'bold' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
            {errors.email && <div>
              <p>{errors.email}</p>
              </div>}
          </div>
    
          <div>
            <label htmlFor="password" style={{ display: 'block', fontWeight: 'bold' }}>
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
            {errors.password && <div>
              <p>{errors.password}</p>
              </div>}
          </div>
    
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            >
            Iniciar sesión
          </button>
        </form>
      );
}

export default LoginComponent;