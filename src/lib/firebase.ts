'use server';
import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore;

if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!serviceAccountString) {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.');
    }

    const serviceAccount = JSON.parse(serviceAccountString);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    
    db = admin.firestore();
    console.log('Firebase Admin SDK initialized successfully.');

  } catch (error) {
    console.warn(
`***********************************************************************
* Firebase Admin SDK initialization failed.
*
* The app will run with mock data. To connect to your database:
* 1. Go to your Firebase Project Settings > Service accounts.
* 2. Click "Generate new private key".
* 3. Copy the entire content of the downloaded JSON file.
* 4. Paste it into the GOOGLE_APPLICATION_CREDENTIALS variable in the .env file.
* 5. Add your database URL to the FIREBASE_DATABASE_URL variable in the .env file.
*
* Error details: ${(error as Error).message}
***********************************************************************`
    );
  }
} else {
  db = admin.app().firestore();
}

// Export a firestore instance that may be null if initialization failed.
// Data store functions will need to handle this null case.
export const firestoreDb = db!;
