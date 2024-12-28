import { Auth, GoogleAuthProvider, User, signInWithPopup as firebaseSignInWithPopup } from 'firebase/auth';

export class FirebaseAuth {
  constructor(private auth: Auth, private signInWithPopup: typeof firebaseSignInWithPopup) {}

  onAuthStateChanged(callback: (user: User | null) => void) {
    return this.auth.onAuthStateChanged(callback);
  }

  async signInWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await this.signInWithPopup(this.auth, provider);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
}
