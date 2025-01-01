import { Program, createProgram } from '@/domain/models/program';
import { programs, users } from '@/infra/firebase/firestore';

interface CreateDraftProgramInput {
  authorId: string;
  slogan?: string;
  description?: string;
  policyAreas: string[];
}

export async function createDraftProgram({ 
  authorId, 
  slogan = '', 
  description = '',
  policyAreas = [] 
}: CreateDraftProgramInput): Promise<Program> {
  
  const program = await programs.create(createProgram({slogan, description, authorId, policyAreas}));
  
  // Update the user's submittedProgram field
  await users.update(authorId, {
    submittedProgram: program.id
  });

  return program;
} 