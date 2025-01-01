import { auth } from "@/infra/firebase/auth"
import { User } from "@/domain/models/user"
import { getUserFromFirebaseUser } from "@/infra/firebase/firestore";

export async function signInWithGoogle(): Promise<User> {
  // Sign in with Google
  const googleUser = await auth.signInWithGoogle();
  if (!googleUser) {
    throw new Error("Failed to sign in with Google");
  }
 
  return getUserFromFirebaseUser(googleUser);


} 