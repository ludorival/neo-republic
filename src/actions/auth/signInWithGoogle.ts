import { User } from "@/domain/models/user";
import { auth } from "@/infra/firebase/auth";
import { users } from "@/infra/firebase/firestore";

export async function signInWithGoogle(): Promise<User> {
  // Sign in with Google
  const googleUser = await auth.signInWithGoogle();
  if (!googleUser) {
    throw new Error("Failed to sign in with Google");
  }

  // Create or update user in database

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
  const existingUser = await users.read(user.id);
  if (!existingUser) {
    await users.create(user);
  }

  return user;
} 