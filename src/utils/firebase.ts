// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { addDoc, collection, deleteDoc, getDoc, getDocs, getFirestore, query } from "firebase/firestore";
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
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


//Imagenes
// const storage = getStorage(app);

// export const uploadImageToFirebase = async (file: File) => {
//     const storageRef = ref(storage, `products/${file.name}`);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     return new Promise<string>((resolve, reject) => {
//         uploadTask.on(
//             "state_changed",
//             null,
//             (error) => reject(error),
//             async () => {
//                 const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//                 resolve(downloadURL);
//             }
//         );
//     });
// };


// export const uploadBase64 = () => {}
