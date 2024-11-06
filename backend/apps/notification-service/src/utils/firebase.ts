import { JWT, Credentials } from 'google-auth-library';
import { FirebaseError, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import * as dotenv from 'dotenv';
import { FirebaseErrorType } from '../enums/firebase.enum';

dotenv.config();

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  email: process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.FIREBASE_SERVICE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const getGoogleCredentials = (): Promise<Credentials> => {
  return new Promise((resolve, reject) => {
    const jwtClient = new JWT({
      email: firebaseConfig.email,
      key: firebaseConfig.key,
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    });
    jwtClient.authorize((error, credentials) => {
      if (error) {
        return reject(error);
      }

      return resolve(credentials!);
    });
  });
};

const firebaseApp = initializeApp({
  projectId: firebaseConfig.projectId,
  credential: {
    getAccessToken: async () => {
      const { access_token, expiry_date } = await getGoogleCredentials();
      return {
        access_token: access_token!,
        expires_in: expiry_date!,
      };
    },
  },
});

export const firebaseMessaging = getMessaging(firebaseApp);

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isRetryableError(error: FirebaseError) {
  // These errors are considered recoverable as per Firebase documentation:
  // https://firebase.google.com/docs/cloud-messaging/send-message#admin
  // If one of these errors is encountered, retrying the operation is recommended.
  const firebaseRetryableErrors: string[] = [
    FirebaseErrorType.UNKNOWN_ERROR,
    FirebaseErrorType.INTERNAL_ERROR,
    FirebaseErrorType.SERVER_UNAVAILABLE,
  ];
  return firebaseRetryableErrors.includes(error.code);
}
