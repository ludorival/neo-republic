'use client'
import { Program } from '@/types/program'
import { Card, CardBody, CardHeader } from '@nextui-org/react'
import { useTranslations } from 'next-intl'

type ProgramsListProps = {
  programs?: Program[]
}

export default function ProgramsList({ programs = [] }: ProgramsListProps) {
  const t = useTranslations('home.programs')

  const CreateProgramCard = () => (
    <Card
      data-testid="create-program-card"
      className="shrink-0 min-w-[300px] max-w-[300px] flex items-center justify-center cursor-pointer hover:bg-default-100"
      isPressable
    >
      <CardBody>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">{t('create.title')}</h3>
          <p className="text-default-500">{t('create.description')}</p>
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
            className="flex-1 text-center py-8 text-default-500"
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
          {programs.map((program) => {
            // Get the first policy area as the main title
            const firstPolicyArea = Object.values(program.policyAreas)[0]
            
            return (
              <Card
                key={program.id}
                data-testid="program-card"
                className="shrink-0 min-w-[300px] max-w-[300px]"
              >
                <CardHeader className="flex flex-col items-start gap-2">
                  <h3 
                    data-testid="program-title"
                    className="text-xl font-semibold"
                  >
                    {firstPolicyArea.title}
                  </h3>
                  <p 
                    data-testid="program-description"
                    className="text-small text-default-500"
                  >
                    {firstPolicyArea.description}
                  </p>
                </CardHeader>
                <CardBody>
                  <div 
                    data-testid="program-metrics"
                    className="flex justify-between items-center"
                  >
                    <div>
                      <div 
                        data-testid="public-support"
                        className="text-success"
                      >
                        {program.metrics.publicSupport}% {t('metrics.support')}
                      </div>
                      <div 
                        data-testid="feasibility-score"
                        className="text-primary"
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
            )
          })}
          <CreateProgramCard />
        </div>
      </div>
    )
  }

  return (
    <div data-testid="programs-list" className="relative">
      <div className="mb-8 text-center">
        <h2 data-testid="programs-header" className="text-3xl font-bold mb-3">
          {t('title')}
        </h2>
        <p data-testid="programs-description" className="text-default-600 max-w-2xl mx-auto">
          {t('description')}
        </p>
      </div>
      {renderProgramsList()}
    </div>
  )
} 