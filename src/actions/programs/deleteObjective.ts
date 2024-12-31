import { Objective, Program } from "@/domain/models/program";
import { programs } from "@/infra/firebase/firestore";

export async function deleteObjective(
{ programId, policyAreaId, objective }: { programId: string; policyAreaId: string; objective: Objective; }): Promise<Program> {
  // Get the current program
  const program = await programs.read(programId)
  if (!program) {
    throw new Error('Program not found')
  }

  // Get the policy area
  const policyArea = program.policyAreas[policyAreaId]
  if (!policyArea) {
    throw new Error('Policy area not found')
  }

  // Check if the index is valid
  const objectiveIndex = policyArea.objectives.findIndex(o => o.label === objective.label)
  if (objectiveIndex < 0 || objectiveIndex >= policyArea.objectives.length) {
    throw new Error('Objective not found')
  }

  // Create updated objectives array by removing the objective at the given index
  const updatedObjectives = policyArea.objectives.filter((_, index) => index !== objectiveIndex)

  // Update the program without the deleted objective
  const updatedProgram: Program = {
    ...program,
    policyAreas: {
      ...program.policyAreas,
      [policyAreaId]: {
        ...policyArea,
        objectives: updatedObjectives
      }
    },
    updatedAt: new Date()
  }

  // Save and return the updated program
  await programs.update(programId, updatedProgram)
  return updatedProgram
} 