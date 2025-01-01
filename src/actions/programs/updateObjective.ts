import { Objective, Program } from "@/domain/models/program";
import { programs } from "@/infra/firebase/firestore";

export async function updateObjective(
{ programId, policyAreaId, objective, label }: { programId: string; policyAreaId: string; objective: Objective; label: string   ; }): Promise<Program> {
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
  const objectiveIndex = policyArea.objectives.findIndex(o => o.label === label)
  if (objectiveIndex < 0 || objectiveIndex >= policyArea.objectives.length) {
    throw new Error('Objective not found')
  }

  // Check if there's another objective with the same label (excluding the current one)
  const hasDuplicateLabel = policyArea.objectives.some(
    (o, index) => index !== objectiveIndex && o.label === objective.label
  )
  if (hasDuplicateLabel) {
    throw new Error('Objective with the same label already exists')
  }

  // Create updated objectives array
  const updatedObjectives = [...policyArea.objectives]
  updatedObjectives[objectiveIndex] = objective

  // Update the program with the modified objective
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