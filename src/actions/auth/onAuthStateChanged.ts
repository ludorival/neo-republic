import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@/domain/models/user';
import { auth } from '@/infra/firebase/auth';
import { getUserFromFirebaseUser } from '@/infra/firebase/firestore';

const CACHE_KEY = 'cached_user';
const CACHE_EXPIRY_KEY = 'cached_user_expiry';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour in milliseconds

function getCachedUser(): User | null {
  try {
    const expiryStr = localStorage.getItem(CACHE_EXPIRY_KEY);
    if (!expiryStr) return null;

    const expiry = parseInt(expiryStr, 10);
    if (Date.now() > expiry) {
      // Cache expired
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_EXPIRY_KEY);
      return null;
    }

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
      localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
    } else {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_EXPIRY_KEY);
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

      // Check if cached user matches current Firebase user
      const cachedUser = getCachedUser();
      if (cachedUser && cachedUser.id === firebaseUser.uid) {
        callback(cachedUser);
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