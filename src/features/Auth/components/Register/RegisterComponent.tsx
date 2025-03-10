'use client';

import { useRegister } from "../../hooks/formRegister";
import { initialRegister } from "../../helpers/initialForm";
import { validateRegister } from "../../helpers/validateForm";

export const RegisterComponent = () => {
  const {
    form,
    errors,
    handleChange,
    handleSubmit,
    handleBlur
  } = useRegister(initialRegister, validateRegister)

    return (
        <form onSubmit={handleSubmit}  style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', fontWeight: 'bold' }}>
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
            {errors.name && <div>
              <p>{errors.name}</p>
              </div>}
          </div>
    
          <div>
            <label htmlFor="lastName" style={{ display: 'block', fontWeight: 'bold' }}>
              Apellido
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
            {errors.lastName && <div>
              <p>{errors.lastName}</p>
              </div>}
          </div>
    
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
    
          <div>
            <label htmlFor="confirmPassword" style={{ display: 'block', fontWeight: 'bold' }}>
              Repetir Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
            {errors.confirmPassword && <div>
              <p>{errors.confirmPassword}</p>
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
            Enviar
          </button>
        </form>
      );
};

export default RegisterComponent;