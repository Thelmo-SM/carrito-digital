import { useState, useEffect } from "react";
import { createShippingAddress, getUserAddresses } from "@/utils/firebase"; // Asegúrate de importar correctamente
import { ShippingAddress } from "@/types/ordersTypes";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import { useAddresses } from "@/store/AddressContext";

export const CreateAddresses = () => {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const user = useAuthUsers();
  const { refreshAddresses } = useAddresses();

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
  }, [user?.uid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.uid) {
      alert("Usuario no autenticado.");
      return;
    }

    const userId = user?.uid;

    const address = {
      street,
      city,
      state,
      postalCode,
      country,
      isDefault: addresses.length === 0, // La primera dirección será la predeterminada
    };

    const  isDefault = addresses.length === 0;

    try {
      await createShippingAddress(userId, address, isDefault);
      alert("Dirección de envío creada exitosamente");
      fetchAddresses();
      setStreet("");
      setCity("");
      setState("");
      setPostalCode("");
      setCountry("");
      refreshAddresses()
    } catch (error) {
      console.error(error);
      alert("Hubo un error al crear la dirección");
    }
  };

  // const handleSetDefault = async (id: string) => {
  //   // Actualizar en la base de datos cuál es la dirección predeterminada
  //   // (Aquí necesitas una función para actualizar en Firestore)

  //   const updatedAddresses = addresses.map((address) => ({
  //     ...address,
  //     isDefault: address.id === id,
  //   }));

  //   setAddresses(updatedAddresses);
  //   alert("Dirección establecida como predeterminada");
  // };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Street:</label>
          <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} required />
        </div>
        <div>
          <label>City:</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div>
          <label>State:</label>
          <input type="text" value={state} onChange={(e) => setState(e.target.value)} required />
        </div>
        <div>
          <label>Postal Code:</label>
          <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
        </div>
        <div>
          <label>Country:</label>
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </div>
        <button type="submit">Crear Dirección</button>
      </form>

      {/* <h3>Direcciones de Envío</h3>
      {addresses.length > 0 ? (
        <ul>
          {addresses
            .sort((a, b) => (b.isDefault ? 1 : -1)) // Mostrar la predeterminada primero
            .map((address) => (
              <li key={address.id}>
                <strong>{address.isDefault ? "★ " : ""}</strong>
                {address.street}, {address.city}, {address.state}, {address.postalCode}, {address.country}
                {!address.isDefault && (
                  <button onClick={() => handleSetDefault(address.id)}>Establecer como predeterminada</button>
                )}
              </li>
            ))}
        </ul>
      ) : (
        <p>No tienes direcciones guardadas.</p>
      )} */}
    </div>
  );
};

export default CreateAddresses;
