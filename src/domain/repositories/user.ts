import { User } from '@/domain/models/user';
import { Database } from './database';

export class UserRepository {
  private readonly COLLECTION = 'users';

  constructor(private readonly db: Database) {}

  async createUser(user: User): Promise<void> {
    await this.db.doc(this.COLLECTION, user.id).set(user);
  }

  async getUser(userId: string): Promise<User | null> {
    const docRef = this.db.doc(this.COLLECTION, userId);
    const exists = await docRef.exists();
    if (!exists) return null;
    return await docRef.data() as User;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    await this.db.doc(this.COLLECTION, userId).update(updates);
  }
} 