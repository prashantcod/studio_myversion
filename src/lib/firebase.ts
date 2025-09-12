
'use server';

import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore | null = null;

if (!admin.apps.length) {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully.');
      db = admin.firestore();
    } catch (error: any) {
      console.error('Firebase Admin SDK initialization error:', error.message);
      console.warn('Could not initialize Firebase Admin SDK. Check your GOOGLE_APPLICATION_CREDENTIALS. Falling back to mock data.');
    }
  } else {
    console.warn('GOOGLE_APPLICATION_CREDENTIALS not set. Firebase Admin SDK not initialized. Falling back to mock data.');
  }
} else {
  // If the app is already initialized, just get the firestore instance.
  db = admin.firestore();
}

// Export a firestore instance that may be null if initialization failed.
// Data store functions will need to handle this null case.
export const firestoreDb = db;
