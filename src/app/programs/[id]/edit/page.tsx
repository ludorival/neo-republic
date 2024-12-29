'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Program } from '@/domain/models/program'
import { programs } from '@/infra/firebase/firestore'
import ProgramForm from '@/app/components/ProgramForm'
import { Spinner } from '@nextui-org/react'
import { readProgram } from '@/actions/programs/readProgram'

export default function EditProgramPage() {
  const { id } = useParams()
  const [program, setProgram] = useState<Program | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProgram = async () => {
      if (typeof id !== 'string') return
      
      const loadedProgram = await readProgram(id)
      setProgram(loadedProgram)
      setIsLoading(false)
    }

    loadProgram()
  }, [id])

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner data-testid="loading-spinner" size="lg" />
      </div>
    )
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
    <div className="container mx-auto">
       <ProgramForm 
          program={program}
          onSubmit={handleSubmit}
        />
    </div>
  )
} 