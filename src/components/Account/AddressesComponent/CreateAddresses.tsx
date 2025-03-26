import { useState, useEffect } from "react";
import { createShippingAddress, getUserAddresses } from "@/utils/firebase"; // Asegúrate de importar correctamente
import { ShippingAddress } from "@/types/ordersTypes";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";

export const CreateAddresses = () => {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const user = useAuthUsers(); 

  // Función para obtener direcciones del usuario
  const fetchAddresses = async () => {
    try {
      if (user?.uid) {
        const userAddresses = await getUserAddresses(user?.uid); // Obtener direcciones
        setAddresses(userAddresses);  // Actualizar el estado con las direcciones obtenidas
      }
    } catch (error) {
      console.error("Error cargando direcciones:", error);
    }
  };

  // Obtener direcciones cuando el componente se monta
  useEffect(() => {
    if (user?.uid) {
      fetchAddresses(); // Cargar direcciones al montar el componente
    }
  }, [user?.uid]); // Solo se ejecuta si el usuario tiene un uid

  // Manejar el envío del formulario para crear una dirección
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = user?.uid; // Obtener el ID del usuario actual

    const address = {
      street,
      city,
      state,
      postalCode,
      country,
    };

    try {
      // Crear dirección en Firestore
      await createShippingAddress(userId, address);
      alert("Dirección de envío creada exitosamente");
      
      // Actualizar las direcciones cargando nuevamente
      fetchAddresses();
      
      // Limpiar el formulario después de crear la dirección
      setStreet("");
      setCity("");
      setState("");
      setPostalCode("");
      setCountry("");
    } catch (error) {
      console.error(error);
      alert("Hubo un error al crear la dirección");
    }
  };

  return (
    <div>
      {/* Formulario para crear una nueva dirección */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Street:</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>State:</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Postal Code:</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear Dirección</button>
      </form>

      {/* Mostrar las direcciones existentes */}
      <h3>Direcciones de Envío</h3>
      {addresses.length > 0 ? (
        <ul>
          {addresses.map((address) => (
            <li key={address.id}>
              {address.street}, {address.city}, {address.state}, {address.postalCode}, {address.country}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes direcciones guardadas.</p>
      )}
    </div>
  );
};

export default CreateAddresses;
