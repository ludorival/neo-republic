import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { FirebaseFirestore } from "@firebase/firestore-types";
import { User } from '@/types/user';

export class UserRepository {
  private readonly COLLECTION = 'users';

  constructor(private readonly db: FirebaseFirestore) {}

  async createUser(user: User): Promise<void> {
    await setDoc(doc(this.db, this.COLLECTION, user.id), user);
  }

  async getUser(userId: string): Promise<User | null> {
    const docSnap = await getDoc(doc(this.db, this.COLLECTION, userId));
    return docSnap.exists() ? docSnap.data() as User : null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    await updateDoc(doc(this.db, this.COLLECTION, userId), updates);
  }
} 