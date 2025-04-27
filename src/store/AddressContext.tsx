import { createContext, useContext, useEffect, useState } from "react";
//import { getUserAddresses, updateShippingAddress } from "@/utils/firebase";
import { updateShippingAddress, getUserAddresses } from "@/features/Account/services/shippingAddressServices";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import { ShippingAddress } from "@/types/ordersTypes";

interface AddressContextType {
    addresses: ShippingAddress[];
    defaultAddress: ShippingAddress | null;
    loading: boolean;
    setLoading: (value: boolean) => void;
    refreshAddresses: () => Promise<void>;
    setDefaultAddress: (id: string) => Promise<void>;  // Nueva función para actualizar la dirección predeterminada
  }
  
  const AddressContext = createContext<AddressContextType | undefined>(undefined);
  
  export const AddressProvider = ({ children }: { children: React.ReactNode }) => {
    const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
    const [loading, setLoading] = useState(false);
    const user = useAuthUsers();
  
    // Obtener direcciones del usuario
    const fetchAddresses = async () => {
      if (!user?.uid) return;
  
      setLoading(true);
      try {
        const userAddresses = await getUserAddresses(user.uid);
        setAddresses(userAddresses);
      } catch (error) {
        console.error("Error obteniendo direcciones:", error);
      } finally {
        setLoading(false);
      }
    };
  
    // Establecer una dirección como predeterminada
    const setDefaultAddress = async (id: string) => {
      try {
        // Cambiar la dirección predeterminada en Firestore
        await updateShippingAddress(user?.uid, id);
  
        // Actualizar las direcciones en el contexto
        const updatedAddresses = addresses.map((address) => ({
          ...address,
          isDefault: address.id === id,
        }));
  
        setAddresses(updatedAddresses);
      } catch (error) {
        console.error("Error al establecer la dirección como predeterminada:", error);
      }
    };
  
    useEffect(() => {
      fetchAddresses();
    }, [user?.uid!]);
  
    const defaultAddress = addresses.find((address) => address.isDefault) || null;
  
    return (
      <AddressContext.Provider value={{ addresses, defaultAddress, loading, setLoading,  refreshAddresses: fetchAddresses, setDefaultAddress }}>
        {children}
      </AddressContext.Provider>
    );
  };
  
  export const useAddresses = () => {
    const context = useContext(AddressContext);
    if (!context) {
      throw new Error("useAddresses debe usarse dentro de un AddressProvider");
    }
    return context;
  };