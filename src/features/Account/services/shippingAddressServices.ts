import { db } from "@/utils/firebase";
import { collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { ShippingAddress } from "@/types/ordersTypes";


export const createShippingAddress = async (userId: string, address: ShippingAddress, isDefault: boolean) => {
  try {
    const addressesRef = collection(db, "shippingAddresses");

    if (isDefault) {
      // Si la nueva dirección es la predeterminada, actualiza todas las demás para quitar isDefault
      const userAddressesQuery = query(addressesRef, where("userId", "==", userId));
      const existingAddresses = await getDocs(userAddressesQuery);

      const updatePromises = existingAddresses.docs.map((doc) =>
        updateDoc(doc.ref, { isDefault: false })
      );
      await Promise.all(updatePromises); // Espera a que todas las actualizaciones se completen
    }

    // Crear la nueva dirección con la propiedad isDefault
    const newAddressRef = doc(addressesRef); // Genera un nuevo ID para la dirección
    await setDoc(newAddressRef, { ...address, userId, isDefault });

    console.log("Dirección de envío creada correctamente.");
  } catch (error) {
    console.error("Error al crear la dirección de envío:", error);
    throw new Error("No se pudo crear la dirección de envío");
  }
};

export const getUserAddresses = async (userId: string): Promise<ShippingAddress[]> => {
    try {
      const addressesSnapshot = await getDocs(
        query(collection(db, "shippingAddresses"), where("userId", "==", userId))
      );
  
      const addresses: ShippingAddress[] = addressesSnapshot.docs.map((doc) => ({
        id: doc.id,
        street: doc.data().street,
        city: doc.data().city,
        state: doc.data().state,
        postalCode: doc.data().postalCode,
        country: doc.data().country,
        isDefault: doc.data().isDefault || false, // Añadimos isDefault con valor por defecto false si no existe en la BD
      }));
  
      return addresses;
    } catch (error) {
      console.error("Error al obtener las direcciones del usuario:", error);
      throw new Error("No se pudieron obtener las direcciones");
    }
  };

  //Establecer dirección predetermionada
export const updateShippingAddress = async (userId: string, addressId: string) => {
  try {
    // Cambiar las demás direcciones para que no sean predeterminadas
    const addressesRef = collection(db, "shippingAddresses");
    const userAddressesQuery = query(addressesRef, where("userId", "==", userId));
    const existingAddresses = await getDocs(userAddressesQuery);
    
    // Actualiza todas las direcciones del usuario, poniéndolas en false
    const updatePromises = existingAddresses.docs.map((doc) =>
      updateDoc(doc.ref, { isDefault: false })
    );
    await Promise.all(updatePromises);

    // Ahora actualiza la dirección específica para ponerla como predeterminada
    const addressRef = doc(db, "shippingAddresses", addressId);
    await updateDoc(addressRef, { isDefault: true });

    console.log("Dirección predeterminada actualizada correctamente.");
  } catch (error) {
    console.error("Error al actualizar la dirección predeterminada:", error);
    throw new Error("No se pudo actualizar la dirección predeterminada");
  }
}

  