import { Program } from '@/domain/models/program';
import { programs } from '@/infra/firebase/firestore';

export async function updateDraftProgram(program: Program): Promise<Program> {
  // First, get the current program to verify its status
  const currentProgram = await programs.read(program.id);
  if (!currentProgram) {
    throw new Error('Program not found');
  }

  // Verify the program is in draft status
  if (currentProgram.status !== 'draft') {
    throw new Error('Only draft programs can be updated');
  }

  const updatedProgram: Program = {
    ...program,
    updatedAt: new Date(),
  };

  // Update the program
  await programs.update(program.id, updatedProgram);

  return updatedProgram;
} 