import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase.ts';

export interface ContactData {
  name: string;
  email: string;
  message: string;
}

export const submitContactToFirebase = async (data: ContactData): Promise<void> => {
  // Create a promise that rejects after 10 seconds
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Request timed out after 10 seconds'));
    }, 10000);
  });

  // Create the Firestore operation promise
  const addDocPromise = addDoc(collection(db, 'contacts'), {
    ...data,
    timestamp: new Date(),
  });

  // Race the two promises - whichever resolves/rejects first wins
  await Promise.race([addDocPromise, timeoutPromise]);
};
