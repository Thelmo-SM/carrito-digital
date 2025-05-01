// utils/validations/validateUserProfile.ts

export type ValidationErrors = {
    name?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }
  
  export const validateUserProfile = (form: {
    name: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): ValidationErrors => {
    const errors: ValidationErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (!form.name.trim()) {
        errors.name = "El nombre es obligatorio.";
      } else if (form.name.trim().length < 2) {
        errors.name = "El nombre debe tener al menos 2 caracteres.";
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.name)) {
        errors.name = "El nombre solo puede contener letras.";
      }
  
      if (!form.lastName.trim()) {
        errors.lastName = "El apellido es obligatorio.";
      } else if (form.lastName.trim().length < 2) {
        errors.lastName = "El apellido debe tener al menos 2 caracteres.";
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.lastName)) {
        errors.lastName = "El apellido solo puede contener letras.";
      }
  
    if (!form.email.trim()) {
      errors.email = "El correo electrónico es obligatorio.";
    } else if (!emailRegex.test(form.email)) {
      errors.email = "Correo electrónico inválido.";
    }
  
    if (form.password) {
      if (form.password.length < 6) {
        errors.password = "La contraseña debe tener al menos 6 caracteres.";
      }
  
      if (form.password !== form.confirmPassword) {
        errors.confirmPassword = "Las contraseñas no coinciden.";
      }
    }
  
    return errors;
  };
  