// Import the functions you need from the SDKs you need
import { orderTypes } from "@/types/ordersTypes";
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { addDoc, collection, deleteDoc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const APYKEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const AUTHDOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const PROJECTID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const STORAGEBUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const MESSAGINGSENDERID = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const APPID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: APYKEY,
  authDomain: AUTHDOMAIN,
  projectId: PROJECTID,
  storageBucket: STORAGEBUCKET,
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;

export const auth = getAuth(app);
export const db = getFirestore(app);

export const setDocument = (path: string, data: any) => {
    data.createdAt = serverTimestamp();
    return setDoc(doc(db, path), data);
};

export const getDocument = async (path: string) => {
  return (await getDoc(doc(db, path))).data();
}

export const signOut = () => {
  localStorage.removeItem('user');
  return auth.signOut();
}

export const sendResetEmail = (email: string) => {
  return sendPasswordResetEmail(auth, email);
}

//coleccion para los productos
export const addDocument = async (path: string, data: any) => {
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

export const getCollection = async (collectionName: string, queryArray?: any[]) => {
  const ref = collection(db, collectionName);
  const q = queryArray ? query(ref, ...queryArray) : query(ref);

  return (await getDocs(q)).docs.map((doc) => ({id: doc.id, ...doc.data()}));
}

export const deleteDocument = async (path: string) => {
  return deleteDoc(doc(db, path));
}

//Editar productos 
export const updateDocument = async (path: string, data: any) => {
  try {
    const docRef = doc(db, path);
    await updateDoc(docRef, data);
    console.log("Documento actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar documento:", error);
    throw new Error("No se pudo actualizar el documento");
  }
};

//Ordenar productos
export const createOrder = async (userId: string, products: { id: string, name: string, price: number, quantity: number, imageUrl: string }[], totalCart: number, shippingAddress: any) => {
  try {
    // Creamos un nuevo documento en la colección "orders"
    const orderRef = await addDoc(collection(db, "orders"), {
      userId,
      products, // Almacenamos los detalles completos de los productos, incluyendo la imagen
      total: totalCart, // El total del carrito
      shippingAddress, // Dirección de envío
      status: "pending", // Estado inicial de la orden
      createdAt: serverTimestamp() // Timestamp de cuando se crea la orden
    });

    console.log("Orden creada con ID: ", orderRef.id); // Log del ID de la orden creada
    return orderRef.id; // Retornamos el ID de la orden creada

  } catch (error) {
    console.error("Error al crear la orden:", error);
    throw new Error("No se pudo crear la orden.");
  }
};


// Obtener todas las órdenes de un usuario específico
export const getUserOrders = async (userId: string) => {
  try {
    const userOrdersSnapshot = await getDocs(
      query(collection(db, "orders"), where("userId", "==", userId))
    );

    const userOrders = await Promise.all(
      userOrdersSnapshot.docs.map(async (docSnapshot) => { // Cambié `doc` a `docSnapshot` para mayor claridad
        const orderData = docSnapshot.data();
        
        const productDetails = await Promise.all(
          orderData.products.map(async (product: { id: string }) => {
            const productDoc = await getDoc(doc(db, "products", product.id));
            if (productDoc.exists()) {
              const productData = productDoc.data();
              return {
                ...productData, // Asegúrate de incluir todos los datos del producto, incluidas las imágenes
                id: product.id
              };
            }
            return null;
          })
        );
    
        return {
          id: docSnapshot.id,
          total: orderData.total,
          status: orderData.status,
          createdAt: orderData.createdAt ? orderData.createdAt.toDate() : null,
          products: productDetails.filter((product) => product !== null),
        };
      })
    );

    return userOrders;
  } catch (error) {
    console.error("Error al obtener las órdenes del usuario:", error);
    throw new Error("No se pudieron obtener las órdenes");
  }
};


//Dirección de envío
export const saveShippingAddress = async (userId: string, address: any) => {
  try {
    const addressRef = doc(db, "shippingAddresses", userId);
    await setDoc(addressRef, address, { merge: true });
    console.log("Dirección de envío guardada correctamente.");
  } catch (error) {
    console.error("Error al guardar la dirección de envío:", error);
    throw new Error("No se pudo guardar la dirección de envío");
  }
};