import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@/domain/models/user';
import { auth } from '@/infra/firebase/auth';
import { getUserFromFirebaseUser } from '@/infra/firebase/firestore';

const CACHE_KEY = 'cached_user';

function getCachedUser(): User | null {
  try {

    const cachedData = localStorage.getItem(CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

function cacheUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CACHE_KEY);
    }
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
}

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  // Try to get user from cache first
  const cachedUser = getCachedUser();
  if (cachedUser) {
    callback(cachedUser);
  }

  return auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
    try {
      if (!firebaseUser) {
        cacheUser(null);
        callback(null);
        return;
      }

      // If no cache or cache miss, fetch from database
      const user = await getUserFromFirebaseUser(firebaseUser);
      cacheUser(user);
      callback(user);
    } catch (error) {
      console.error('Error in auth state change:', error);
      callback(null);
    }
  });
}; 