import { getAuth, signInWithPopup } from "firebase/auth";
import { firebaseApp } from "./clientApp";
import { FirebaseAuth } from "./FirebaseAuth";

// Export a default instance using the Firebase auth
export const auth = new FirebaseAuth(getAuth(firebaseApp), signInWithPopup);