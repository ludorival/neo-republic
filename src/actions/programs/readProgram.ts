import { Program } from '@/domain/models/program';
import { programs } from '@/infra/firebase/firestore';

export async function readProgram(id: string): Promise<Program | null> {
  try {
    return await programs.read(id);
  } catch (error) {
    console.error('Failed to read program:', error);
    return null;
  }
} 