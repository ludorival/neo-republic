'use client'
import { Button, Card, Spinner } from '@nextui-org/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Program } from '@/domain/models/program'
import ViewProgram from '@/app/components/ViewProgram'
import { readProgram } from '@/actions/programs/readProgram'

export default function ProgramViewPage() {
  const { id } = useParams()
  const [program, setProgram] = useState<Program | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const t = useTranslations()

  useEffect(() => {
    const loadProgram = async () => {
      if (typeof id !== 'string') return
      
      const loadedProgram = await readProgram(id)
      setProgram(loadedProgram)
      setIsLoading(false)
    }

    loadProgram()
  }, [id])

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
        <Card className="p-8 bg-white/5 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-white mb-4">
            {t('programs.notFound')}
          </h1>
          <Button
            as={Link}
            href="/"
            color="primary"
          >
            {t('programs.backToList')}
          </Button>
        </Card>
      </div>
    )
  }

  return <ViewProgram program={program} />
} 