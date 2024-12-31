import { PolicyArea, computePolicyAreaBudget } from '@/domain/models/program'
import { Card, CardBody, Link } from '@nextui-org/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type PolicyAreaCardProps = {
  id: string
  area: PolicyArea
  isSelected: boolean
  onSelect: (id: string) => void
}

export default function PolicyAreaCard({
  id,
  area,
  isSelected,
  onSelect
}: PolicyAreaCardProps) {
  const t = useTranslations('programs.policyAreas')
  const isComplete = area.objectives.length > 0
  const { totalRevenue, totalExpenses } = computePolicyAreaBudget(area)
  const [expandedObjectives, setExpandedObjectives] = useState<number[]>([])

  const toggleObjective = (index: number) => {
    setExpandedObjectives(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const handleMoreClick = (index: number) => {
    //e.stopPropagation()
    toggleObjective(index)
  }

  const areaTitle = t(`${id}.title`)
  const areaDescription = t(`${id}.description`)
  
  return (
    <Card
      isPressable
      onPress={() => onSelect(id)}
      className={`bg-white/10 backdrop-blur-sm hover:bg-white/50 transition-colors ${isComplete ? 'border-success border-2' : ''} ${isSelected ? 'ring-2 ring-primary' : ''}`}
      data-testid="policy-area-card"
    >
      <CardBody className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-white">
            {areaTitle}
          </h3>
          <div 
            data-testid={isComplete ? "policy-area-status-complete" : "policy-area-status-incomplete"}
            className={`rounded-full w-3 h-3 ${isComplete ? 'bg-success' : 'bg-white/30'}`}
          />
        </div>
        <p className="text-white/70 mb-3">
          {areaDescription}
        </p>
        {area.objectives.length > 0 ? (
          <>
            <ul className="space-y-2 mb-3">
              {area.objectives.map((objective, index) => (
                <li key={index} className="text-sm text-white/80">
                  <div className="flex items-center mb-1">
                    <Link 
                      className="flex-grow text-white/80 hover:text-white hover:underline hover:decoration-white" 
                      onPress={() => handleMoreClick(index)}
                      data-testid={`objective-label-${index}`}
                    >
                      {expandedObjectives.includes(index) ? (
                        <span>▼ {objective.label}</span>
                      ) : (
                        <span>▶ {objective.label}</span>
                      )}
                    </Link>
                  </div>
                  {expandedObjectives.includes(index) && (
                    <div className="ml-4 mb-2 text-xs text-white/70" data-testid={`objective-details-${index}`}>
                      {objective.details}
                    </div>
                  )}
                  <div className="ml-4 flex justify-between text-xs">
                    <span className="text-success-400">+{objective.budget.revenue}k€</span>
                    <span className="text-danger-400">-{objective.budget.expenses}k€</span>
                    <span className={objective.budget.revenue >= objective.budget.expenses ? 'text-success-400' : 'text-danger-400'}>
                      {objective.budget.revenue >= objective.budget.expenses ? '✓' : '!'} {objective.budget.revenue - objective.budget.expenses}k€
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <p className="text-success-400">
                  +{totalRevenue}k€
                </p>
                <p className="text-danger-400">
                  -{totalExpenses}k€
                </p>
              </div>
              <div className="flex justify-end mt-1">
                <p className={`text-sm ${totalRevenue >= totalExpenses ? 'text-success-400' : 'text-danger-400'}`}>
                  {totalRevenue >= totalExpenses ? '✓' : '!'} {totalRevenue - totalExpenses}k€
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-white/50 italic">
            No objectives yet
          </p>
        )}
      </CardBody>
    </Card>
  )
} 