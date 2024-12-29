'use client'
import { Program } from '@/domain/models/program'
import { Card, CardBody, CardHeader } from '@nextui-org/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import LoginModal from './LoginModal'
import { useAuth } from '@/app/hooks/useAuth'
import { useRouter } from 'next/navigation'

type ProgramsListProps = {
  programs?: Program[]
}

export default function ProgramsList({ programs = [] }: ProgramsListProps) {
  const t = useTranslations('programs')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { currentUser } = useAuth()
  const router = useRouter()

  const handleCreateProgramClick = () => {
    if (!currentUser) {
      setIsLoginModalOpen(true)
      return
    }
    router.push('/programs/create')
  }

  const CreateProgramCard = () => (
    <Card
      data-testid="create-program-card"
      className="shrink-0 min-w-[300px] max-w-[300px] flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-sm"
      isPressable
      onPress={handleCreateProgramClick}
    >
      <CardBody>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2 text-white">{t('create.title')}</h3>
          <p className="text-white/80">{t('create.description')}</p>
        </div>
      </CardBody>
    </Card>
  )

  const renderProgramsList = () => {
    if (programs.length === 0) {
      return (
        <div 
          data-testid="programs-list"
          className="flex gap-4"
        >
          <div 
            data-testid="programs-empty"
            className="flex-1 text-center py-8 text-white/80"
          >
            {t('empty')}
          </div>
          <CreateProgramCard />
        </div>
      )
    }

    return (
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-4">
          {programs.map((program) => (
            <Card
              key={program.id}
              data-testid="program-card"
              className="shrink-0 min-w-[300px] max-w-[300px] bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-sm"
            >
              <CardHeader className="flex flex-col items-start gap-2">
                <h3 
                  data-testid="program-slogan"
                  className="text-xl font-semibold text-white"
                >
                  {program.slogan}
                </h3>
                <p 
                  data-testid="program-description"
                  className="text-small text-white/80"
                >
                  {program.description}
                </p>
              </CardHeader>
              <CardBody>
                <div 
                  data-testid="program-metrics"
                  className="flex justify-between items-center text-white"
                >
                  <div>
                    <div 
                      data-testid="public-support"
                      className="text-success-400"
                    >
                      {program.metrics.publicSupport}% {t('metrics.support')}
                    </div>
                    <div 
                      data-testid="feasibility-score"
                      className="text-primary-300"
                    >
                      {program.metrics.feasibilityScore}% {t('metrics.feasible')}
                    </div>
                  </div>
                  <div 
                    data-testid="votes-count"
                    className="text-lg font-semibold"
                  >
                    {program.metrics.votes} {t('metrics.votes')}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
          <CreateProgramCard />
        </div>
      </div>
    )
  }

  return (
    <div data-testid="programs-list" className="relative">
      <div className="mb-8 text-center">
        <h2 data-testid="programs-header" className="text-3xl font-bold mb-3 text-white">
          {t('title')}
        </h2>
        <p data-testid="programs-description" className="text-white/80 max-w-2xl mx-auto">
          {t('description')}
        </p>
      </div>
      {renderProgramsList()}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => router.push('/programs/create')}
      />
    </div>
  )
} 