'use client'
import { readProgram } from '@/actions/programs/readProgram'
import ProgramForm from '@/app/components/ProgramForm'
import { Program } from '@/domain/models/program'
import { programs } from '@/infra/firebase/firestore'
import { useParams } from 'next/navigation'

export default async function EditProgramPage() {
  const { id } = useParams()
  const program = await readProgram(id as string)


  const handleSubmit = async (updatedProgram: Program) => {
    if (!program) return
    try {
      await programs.update(program.id, updatedProgram)
      // You might want to show a success notification here
    } catch (error) {
      console.error('Failed to update program:', error)
      // You might want to show an error notification here
    }
  }

  if (!program) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-white">
          Program not found
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 lg:px-12">
       <ProgramForm 
          program={program}
          onSubmit={handleSubmit}
        />
    </div>
  )
} 