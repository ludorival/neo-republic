import { Program } from '@/domain/models/program'
import { programs } from '@/infra/firebase/firestore'

export async function publishProgramForReview(program: Program): Promise<Program> {
  if (!program.id) {
    throw new Error('Program ID is required')
  }

  // Check if program has at least one objective in each policy area
  const hasObjectivesInAllAreas = Object.values(program.policyAreas).every(
    area => area.objectives.length > 0
  )

  if (!hasObjectivesInAllAreas) {
    throw new Error('All policy areas must have at least one objective')
  }

  const updatedProgram: Program = {
    ...program,
    status: 'under_review',
    updatedAt: new Date()
  }

  await programs.update(program.id, updatedProgram)
  return updatedProgram
} 