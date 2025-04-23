// src/utils/firebaseAdmin.ts
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const authAdmin = admin.auth();
const db = admin.firestore();

export { authAdmin, db };