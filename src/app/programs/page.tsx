'use client'
import { readPublishedPrograms } from '@/actions/programs/readPublishedPrograms'
import ProgramsList from '@/app/components/ProgramsList'
import { Program } from '@/domain/models/program'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export default function ProgramsPage() {
  const t = useTranslations()
  const [programs, setPrograms] = useState<Program[]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const publishedPrograms = await readPublishedPrograms()
        setPrograms(publishedPrograms)
      } catch (error) {
        console.error('Failed to load programs:', error)
        setError(error as Error)
      }
    }

    loadPrograms()
  }, [])

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-danger">
          {t('programs.error')}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProgramsList programs={programs} />
    </div>
  )
} 