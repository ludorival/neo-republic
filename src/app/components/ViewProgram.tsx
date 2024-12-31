'use client'
import { Program } from '@/domain/models/program'
import { Button, Card } from '@nextui-org/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import PolicyAreaCard from './PolicyAreaCard'

type ViewProgramProps = {
  program: Program
}

export default function ViewProgram({ program }: ViewProgramProps) {
  const t = useTranslations()
  const policyAreaKeys = t('programs.policyAreaKeys').split(',')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {program.slogan}
          </h1>
          <p className="text-white/70">
            {program.description}
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            as={Link}
            href="/programs"
            variant="flat"
            color="default"
          >
            {t('programs.backToList')}
          </Button>
          {program.status === 'draft' && (
            <Button
              as={Link}
              href={`/programs/${program.id}/edit`}
              color="primary"
            >
              {t('programs.form.editProgram')}
            </Button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policyAreaKeys.map((areaKey) => (
          <PolicyAreaCard
            key={areaKey}
            id={areaKey}
            area={program.policyAreas[areaKey]}
            isSelected={false}
            onSelect={() => {}}
          />
        ))}
      </div>

      {program.status === 'published' && (
        <Card className="mt-8 p-6 bg-white/5 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                {t('programs.metrics.title')}
              </h2>
              <div className="flex gap-8">
                <div>
                  <p className="text-white/70">{t('programs.metrics.support')}</p>
                  <p className="text-2xl font-bold text-white">{program.metrics.publicSupport}%</p>
                </div>
                <div>
                  <p className="text-white/70">{t('programs.metrics.feasible')}</p>
                  <p className="text-2xl font-bold text-white">{program.metrics.feasibilityScore}%</p>
                </div>
                <div>
                  <p className="text-white/70">{t('programs.metrics.votes')}</p>
                  <p className="text-2xl font-bold text-white">{program.metrics.votes}</p>
                </div>
              </div>
            </div>
            <Button
              color="primary"
              size="lg"
            >
              {t('programs.vote')}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
} 