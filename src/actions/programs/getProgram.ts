import { Program } from '@/domain/models/program'
import { programs } from '@/infra/firebase/firestore'

export async function getProgram(id: string): Promise<Program | null> {
  try {
    return await programs.read(id)
  } catch (error) {
    console.error('Error fetching program:', error)
    return null
  }
} 