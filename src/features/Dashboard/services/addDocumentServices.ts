import { db } from "@/utils/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, query, QueryConstraint, serverTimestamp, updateDoc } from "firebase/firestore";
import { productsTypes } from "@/types/productTypes";


export const addDocument = async (path: string, data: productsTypes) => {
  data.createdAt = serverTimestamp();

  try {
    const docRef = await addDoc(collection(db, path), data);
    console.log('Documento agregado con ID: ', docRef.id);
    return docRef.id; // Devolver el ID si se necesita usar más adelante
  } catch (error) {
    console.error('Error al agregar el documento: ', error);
    throw new Error('Error al agregar el documento');
  }
};

type FirestoreQueryArray = QueryConstraint[];

export const getCollection = async (collectionName: string, queryArray?: FirestoreQueryArray) => {
  const ref = collection(db, collectionName);
  const q = queryArray ? query(ref, ...queryArray) : query(ref);

  return (await getDocs(q)).docs.map((doc) => ({id: doc.id, ...doc.data()}));
}

export const deleteDocument = async (path: string) => {
  return deleteDoc(doc(db, path));
}

//Editar productos 
export const updateDocument = async (path: string, data: Partial<productsTypes>) => {
    try {
      const docRef = doc(db, path);
      await updateDoc(docRef, data);
      console.log("Documento actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar documento:", error);
      throw new Error("No se pudo actualizar el documento");
    }
  };