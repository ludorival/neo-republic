import { Program } from '@/domain/models/program';
import { programs } from '@/infra/firebase/firestore';

export async function readPublishedPrograms(): Promise<Program[]> {
  try {
    return await programs.findAllBy('status', '==', 'published');
  } catch (error) {
    console.error('Failed to read published programs:', error);
    throw error;
  }
} 