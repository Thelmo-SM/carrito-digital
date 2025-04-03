// Import the functions you need from the SDKs you need
import { Review, ShippingAddress } from "@/types/ordersTypes";
import { productsTypes } from "@/types/productTypes";
import { usersTypes } from "@/types/usersTypes";
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail, updateEmail, updatePassword, updateProfile } from "firebase/auth";
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

//getProductsWithReviews 
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

// Actualizar perfil del usuario
export const updateUserProfile = async (uid: string, updatedData: any) => {
  try {
    const userDocRef = doc(db, "users", uid); // Asegúrate de estar apuntando al documento correcto
    await updateDoc(userDocRef, updatedData); // Actualiza solo los campos que cambiaron
    console.log("Perfil actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    throw error;
  }
};


export const updateUserEmail = async (newEmail: string) => {
  if (!auth.currentUser) return;
  await updateEmail(auth.currentUser, newEmail);
};

export const updateUserPassword = async (newPassword: string) => {
  if (!auth.currentUser) return;
  await updatePassword(auth.currentUser, newPassword);
};


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
          shippingAddress: orderData.shippingAddress || {}
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

//Crear direcciones
export const createShippingAddress = async (userId: string, address: any, isDefault: boolean) => {
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

//Ver direcciones
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




// Función para calcular el promedio de calificaciones
async function updateAverageRating(productId: string) {
  const reviewsRef = collection(db, `products/${productId}/reviews`);
  const reviewsSnapshot = await getDocs(reviewsRef);
  
  const reviews = reviewsSnapshot.docs.map(doc => doc.data());
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;

  // Actualizar el producto con el nuevo promedio
  const productRef = doc(db, `products/${productId}`);
  await updateDoc(productRef, { averageRating });
}

// Agregar una reseña
export async function addReview({ productId, userId, rating, comment }: { productId: string, userId: string, rating: number, comment: string }) {
  if (rating < 1 || rating > 5) throw new Error("Rating debe estar entre 1 y 5");

  const reviewsRef = collection(db, `products/${productId}/reviews`);
  await addDoc(reviewsRef, { userId, rating, comment, createdAt: new Date() });
  
  await updateAverageRating(productId);
}

// Obtener productos con sus reseñas
export async function getProductsWithReviews() {
  const productsRef = collection(db, "products");
  const productsSnapshot = await getDocs(productsRef);
  const products = await Promise.all(productsSnapshot.docs.map(async (docSnap) => {
    const productData = docSnap.data();
    const reviewsRef = collection(db, `products/${docSnap.id}/reviews`);
    const reviewsSnapshot = await getDocs(reviewsRef);
    const reviews = reviewsSnapshot.docs.map(reviewDoc => reviewDoc.data());
    return { id: docSnap.id, ...productData, reviews };
  }));

  return products;
}

// Obtener el rating promedio de un producto
export async function getProductRating(productId) {
  const productRef = doc(db, `products/${productId}`);
  const productSnap = await getDoc(productRef);
  if (!productSnap.exists()) throw new Error("Producto no encontrado");

  return productSnap.data().averageRating || 0;
}

// Actualizar una reseña
export async function updateReview(productId, reviewId, rating, comment) {
  if (rating < 1 || rating > 5) throw new Error("Rating debe estar entre 1 y 5");

  const reviewRef = doc(db, `products/${productId}/reviews/${reviewId}`);
  await updateDoc(reviewRef, { rating, comment, updatedAt: new Date() });
  
  await updateAverageRating(productId);
}

// Eliminar una reseña
export async function deleteReview(productId, reviewId) {
  const reviewRef = doc(db, `products/${productId}/reviews/${reviewId}`);
  await deleteDoc(reviewRef);
  
  await updateAverageRating(productId);
}

export async function getProductsUserReviews(userId: string) {
  const ordersRef = collection(db, "orders");
  const ordersSnapshot = await getDocs(ordersRef);
  
  // Filtrar las órdenes que pertenecen al usuario
  const userOrders = ordersSnapshot.docs.filter(orderDoc => {
    const orderData = orderDoc.data();
    return orderData.userId === userId; // Solo las órdenes del usuario
  });

  // Obtener productos con sus reseñas de las órdenes del usuario
  const orders = await Promise.all(userOrders.map(async (orderDoc) => {
    const orderData = orderDoc.data();
    
    const productsWithReviews = await Promise.all(orderData.products.map(async (product) => {
      // Aquí estamos obteniendo el producto específico desde la colección de productos
      const productRef = doc(db, `products/${product.id}`);
      const productSnap = await getDoc(productRef);

      // Si el producto no existe, lo omitimos
      if (!productSnap.exists()) return null;

      const productData = productSnap.data();
      
      // Obtener las reseñas de ese producto
      const reviewsRef = collection(db, `products/${product.id}/reviews`);
      const reviewsSnapshot = await getDocs(reviewsRef);
      const reviews = reviewsSnapshot.docs.map(reviewDoc => reviewDoc.data());

      // Regresar los productos con sus reseñas
      return {
        id: product.id,
        name: productData?.name,  // Asumiendo que el producto tiene un campo `name`
        description: productData?.description,  // Asumiendo que el producto tiene un campo `description`
        price: productData?.price,  // Asumiendo que el producto tiene un campo `price`
        reviews,  // Reseñas asociadas al producto
      };
    }));

    // Filtrar productos nulos (por si acaso algún producto no existe)
    const validProducts = productsWithReviews.filter((product) => product !== null);

    return {
      id: orderDoc.id,
      total: orderData.total,
      status: orderData.status,
      createdAt: orderData.createdAt.toDate(),
      products: validProducts,  // Solo productos válidos
      shipping: orderData.shipping,
    };
  }));

  return orders;
}

export async function getTopRatedProducts(): Promise<productsTypes[]> {
  const productsRef = collection(db, "products");
  const productsSnapshot = await getDocs(productsRef);

  const products = await Promise.all(
    productsSnapshot.docs.map(async (docSnap) => {
      const productData = docSnap.data();

      // Extraer los datos del producto con valores por defecto
      const {
        name = "",
        price = 0,
        soldUnits = 0,
        categorie = [],
        description = "",
        imageUrl = "",
      } = productData;

      // Obtener las reviews
      const reviewsRef = collection(db, `products/${docSnap.id}/reviews`);
      const reviewsSnapshot = await getDocs(reviewsRef);
      
      const reviews: Review[] = reviewsSnapshot.docs.map((reviewDoc) => {
        const reviewData = reviewDoc.data();

        return {
          userId: reviewData.userId ?? "",
          rating: Number(reviewData.rating) || 0,
          comment: reviewData.comment ?? "",
          createdAt: reviewData.createdAt?.toDate?.() || null,
        };
      });

      // Calcular la puntuación promedio de las reseñas
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
          : 0;

      // Retornar el producto con las reviews correctamente tipadas
      return {
        id: docSnap.id,
        name,
        price,
        soldUnits,
        categorie,
        description,
        imageUrl,
        reviews,
        avgRating,
      };
    })
  );

  // Ordenar los productos por rating promedio, de mayor a menor
  return products.sort((a, b) => b.avgRating - a.avgRating);
}