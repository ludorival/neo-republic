
import { Program } from "@/domain/models/program";
import { User } from "@/domain/models/user";
import { Vote } from "@/domain/models/vote";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./clientApp";
import { FirebaseCRUDRepository } from "./FirebaseCRUDRepository";
import { ProgramRepository } from "@/domain/repositories/program";
import { UserRepository } from "@/domain/repositories/user";
import { VoteRepository } from "@/domain/repositories/vote";
import { User as FirebaseUser } from 'firebase/auth';

const firestore = getFirestore(firebaseApp);

export const users : UserRepository = new FirebaseCRUDRepository<string, User>(firestore, 'users');
export const programs : ProgramRepository = new FirebaseCRUDRepository<string, Program>(firestore, 'programs');
export const votes : VoteRepository = new FirebaseCRUDRepository<string, Vote>(firestore, 'votes');

export async function getUserFromFirebaseUser(firebaseUser: FirebaseUser): Promise<User> {
    const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName!,
        profile: {
          avatar: firebaseUser.photoURL ?? undefined,
        },
        role: "citizen",
        createdAt: new Date(),
      };
    
      // Try to get existing user first
      const existingUser = await users.read(user.id);
      if (!existingUser) {
        await users.create(user);
      }
      return existingUser ?? user;
  }