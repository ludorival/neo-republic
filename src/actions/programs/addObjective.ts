import { Objective, Program } from "@/domain/models/program";
import { programs } from "@/infra/firebase/firestore";

export async function addObjective(
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

  // ensure there are not the same objective with the same label
  const existingObjective = policyArea.objectives.find((o) => o.label === objective.label)
  if (existingObjective) {
    throw new Error('Objective with the same label already exists')
  }


  // Update the program with the new objective
  const updatedProgram: Program = {
    ...program,
    policyAreas: {
      ...program.policyAreas,
      [policyAreaId]: {
        ...policyArea,
        objectives: [...policyArea.objectives, objective]
      }
    },
    updatedAt: new Date()
  }

  // Save and return the updated program
  await programs.update(programId, updatedProgram)
  return updatedProgram
} 