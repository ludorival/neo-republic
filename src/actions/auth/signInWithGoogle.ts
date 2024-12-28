import { User } from "@/domain/models/user";
import { UserRepository } from "@/domain/repositories/user";
import { auth } from "@/infra/firebase/auth";
import { db } from "@/infra/firebase/firestore";

export async function signInWithGoogle(): Promise<User> {
  // Sign in with Google
  const googleUser = await auth.signInWithGoogle();
  if (!googleUser) {
    throw new Error("Failed to sign in with Google");
  }

  // Create or update user in database
  const userRepository = new UserRepository(db);

  const user: User = {
    id: googleUser.uid,
    email: googleUser.email!,
    displayName: googleUser.displayName!,
    profile: {
      avatar: googleUser.photoURL ?? undefined,
    },
    role: "citizen",
    createdAt: new Date(),
  };

  // Try to get existing user first
  const existingUser = await userRepository.getUser(user.id);
  if (!existingUser) {
    await userRepository.createUser(user);
  }

  return user;
} 