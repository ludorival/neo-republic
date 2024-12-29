import { Program, PolicyArea } from '@/domain/models/program';
import { programs } from '@/infra/firebase/firestore';
import { users } from '@/infra/firebase/firestore';

interface CreateDraftProgramInput {
  authorId: string;
  slogan?: string;
  description?: string;
  policyAreas?: Record<string, PolicyArea>;
}

export async function createDraftProgram({ 
  authorId, 
  slogan = '', 
  description = '',
  policyAreas = {} 
}: CreateDraftProgramInput): Promise<Program> {
  const now = new Date();
  
  const draft: Omit<Program, 'id'> = {
    slogan,
    description,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    authorId,
    policyAreas,
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