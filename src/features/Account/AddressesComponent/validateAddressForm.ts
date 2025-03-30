import { ShippingAddress } from "@/types/ordersTypes";


export const validateAddressForm = (formData: ShippingAddress) => {
    const errors: Record<string, string> = {};
  
    if (!formData.street.trim()) {
      errors.street = "La calle es obligatoria.";
    }
  
    if (!formData.city.trim()) {
      errors.city = "La ciudad es obligatoria.";
    }
  
    if (!formData.state.trim()) {
      errors.state = "El estado es obligatorio.";
    }
  
    if (!formData.postalCode.trim()) {
      errors.postalCode = "El código postal es obligatorio.";
    } else if (!/^[0-9]{4,6}$/.test(formData.postalCode)) {
      errors.postalCode = "El código postal debe tener entre 4 y 6 dígitos numéricos.";
    }
  
    if (!formData.country.trim()) {
      errors.country = "El país es obligatorio.";
    }
  
    return errors;
  };
  