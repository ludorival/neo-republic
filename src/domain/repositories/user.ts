import { User } from '@/domain/models/user';
import { CRUDRepository } from './baseRepository';

export interface UserRepository extends CRUDRepository<string, User> {
}
