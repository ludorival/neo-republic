'use client'
import { Program, computeProgramBudget } from '@/domain/models/program'
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
  const { totalRevenue, totalExpenses } = computeProgramBudget(program)
  const balance = totalRevenue - totalExpenses

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

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
            href="/"
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

      <Card className="mb-8 p-6 bg-white/5 backdrop-blur-sm" data-testid="program-budget">
        <h2 className="text-xl font-semibold text-white mb-4">
          {t('programs.budget.title')}
        </h2>
        <div className="flex gap-8">
          <div>
            <p className="text-white/70">{t('programs.budget.revenue')}</p>
            <p className="text-2xl font-bold text-success" data-testid="total-revenue">
              <span data-testid="total-revenue-value">{formatNumber(totalRevenue)}</span>
              <span className="ml-1">k€</span>
            </p>
          </div>
          <div>
            <p className="text-white/70">{t('programs.budget.expenses')}</p>
            <p className="text-2xl font-bold text-danger" data-testid="total-expenses">
              <span data-testid="total-expenses-value">{formatNumber(totalExpenses)}</span>
              <span className="ml-1">k€</span>
            </p>
          </div>
          <div>
            <p className="text-white/70">{t('programs.budget.balance')}</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-success' : 'text-danger'}`} data-testid="total-balance">
              <span data-testid="total-balance-value">{formatNumber(balance)}</span>
              <span className="ml-1">k€</span>
            </p>
          </div>
        </div>
      </Card>

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