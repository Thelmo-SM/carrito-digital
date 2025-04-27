import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import { useAddresses } from "@/store/AddressContext";
import { ShippingAddress } from "@/types/ordersTypes";
// import { createShippingAddress, getUserAddresses } from "@/utils/firebase";
import { createShippingAddress, getUserAddresses } from "../services/shippingAddressServices";
import { useCallback, useEffect, useState } from "react";



    type SimpleAddress = Omit<ShippingAddress, "id" | "isDefault">;
    type AddressErrors = {
    [key in keyof SimpleAddress]?: string;
  };

  export const useCreateAddress = (initialValue: ShippingAddress, validateForm: (value: ShippingAddress) => AddressErrors) => {
  const [form, setForm] = useState(initialValue);
  const [errors, setErrors] = useState<AddressErrors>({});
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
    const user = useAuthUsers();
      const { refreshAddresses } = useAddresses();

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setForm((capture) => ({
            ...capture,
            [name]:value,
        }));
    };

    const handleBlur = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target as { name: keyof SimpleAddress; value: string };
    
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateForm({ ...form, [name]: value })[name],
          }));
        },
        [form, validateForm]
      );


     const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!user?.uid) {
          alert("Usuario no autenticado.");
          return;
        }
    
        const userId = user?.uid;
    
        const address = {
          street: form.street,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
          isDefault: addresses.length === 0, // La primera dirección será la predeterminada
        };
    
        const  isDefault = addresses.length === 0;
    
        try {
          await createShippingAddress(userId, address, isDefault);
          refreshAddresses();
          alert("Dirección de envío creada exitosamente");
          setForm(initialValue);
        } catch (error) {
          console.error(error);
          alert("Hubo un error al crear la dirección");
        }
      };

        // Obtener direcciones del usuario
        const fetchAddresses = async () => {
          try {
            if (user?.uid) {
              const userAddresses = await getUserAddresses(user?.uid);
              setAddresses(userAddresses);
            }
          } catch (error) {
            console.error("Error cargando direcciones:", error);
          }
        };
      
        useEffect(() => {
          if (user?.uid) {
            fetchAddresses();
          }
        }, [user?.uid!]);
      
    return {
        form,
        errors,
        handleChange,
        handleBlur,
        handleSubmit
    }
}