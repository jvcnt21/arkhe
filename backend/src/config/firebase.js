import admin from 'firebase-admin';
import serviceAccount from './firebaseServiceAccountKey.json' with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'arkhe-6f247.appspot.com'
});

export const db = admin.firestore();
export { admin };
