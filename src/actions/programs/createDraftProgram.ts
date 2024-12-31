import { PolicyArea, Program, createProgram } from '@/domain/models/program';
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
  const now = new Date();
  
  const draft: Omit<Program, 'id'> = {
    slogan,
    description,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    authorId,
    policyAreas: policyAreas.reduce((acc, policyArea) => {
      acc[policyArea] = {
        objectives: [],
      };
      return acc;
    }, {} as Record<string, PolicyArea>),
    financialValidation: {
      totalBudget: 0,
      isBalanced: false,
      reviewComments: [],
    },
    metrics: {
      publicSupport: 0,
      feasibilityScore: 0,
      votes: 0,
    }
  };

  const program = await programs.create(draft);
  
  // Update the user's submittedProgram field
  await users.update(authorId, {
    submittedProgram: program.id
  });

  return program;
} 