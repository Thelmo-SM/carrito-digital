import { db } from "@/utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ShippingAddress } from "@/types/ordersTypes";


export const saveShippingAddress = async (userId: string, address: ShippingAddress) => {
  try {
    const addressRef = doc(db, "shippingAddresses", userId);
    await setDoc(addressRef, address, { merge: true });
    console.log("Dirección de envío guardada correctamente.");
  } catch (error) {
    console.error("Error al guardar la dirección de envío:", error);
    throw new Error("No se pudo guardar la dirección de envío");
  }
};