
import * as admin from 'firebase-admin';

// This file is responsible for initializing the Firebase Admin SDK for backend use.

// Prevent re-initialization in a hot-reloading environment (like Next.js dev server)
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // Add your databaseURL if you are using Realtime Database
      // databaseURL: `https://your-project-id.firebaseio.com`
    });
     console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.stack);
    // Throw an error to prevent the app from starting with a misconfigured Firebase connection.
    throw new Error('Failed to initialize Firebase Admin SDK. Please check your GOOGLE_APPLICATION_CREDENTIALS environment variable.');
  }
}

// Export the initialized admin instance, which provides access to all Firebase services
export const firebaseAdmin = admin;
export const firestoreDb = admin.firestore();
