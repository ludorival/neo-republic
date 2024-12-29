import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@/domain/models/user';
import { auth } from '@/infra/firebase/auth';
import { getUserFromFirebaseUser } from '@/infra/firebase/firestore';

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }
    callback(await getUserFromFirebaseUser(firebaseUser));
  });
}; 