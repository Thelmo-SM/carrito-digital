import { useState, useEffect } from "react";
import { createShippingAddress, getUserAddresses } from "@/utils/firebase"; // Asegúrate de importar correctamente
import { ShippingAddress } from "@/types/ordersTypes";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import { useAddresses } from "@/store/AddressContext";
import { LabelUi, ButtonSubmitUi, InputUi, DivForm, FormUi, ContainerUi } from "@/components/UI";

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
  }, [user?.uid!]);

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

  return (
    <ContainerUi>
      <h2>Agregar nueva dirrección</h2>
      <FormUi onSubmit={handleSubmit}>
        <DivForm>
          <LabelUi>Calle:</LabelUi>
          <InputUi type="text" value={street} onChange={(e) => setStreet(e.target.value)} required />
        </DivForm>
        <DivForm>
          <LabelUi>Ciudad:</LabelUi>
          <InputUi type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
        </DivForm>
        <DivForm>
          <LabelUi>Estado:</LabelUi>
          <InputUi type="text" value={state} onChange={(e) => setState(e.target.value)} required />
        </DivForm>
        <DivForm>
          <LabelUi>Código Postal:</LabelUi>
          <InputUi type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
        </DivForm>
        <DivForm>
          <LabelUi>País:</LabelUi>
          <InputUi type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </DivForm>
        <ButtonSubmitUi type="submit">Crear Dirección</ButtonSubmitUi>
      </FormUi>
    </ContainerUi>
  );
};

export default CreateAddresses;
