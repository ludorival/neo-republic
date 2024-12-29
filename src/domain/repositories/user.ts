import { User } from '@/domain/models/user';
import { CRUDRepository } from './baseRepository';

export type UserRepository = CRUDRepository<string, User>;
