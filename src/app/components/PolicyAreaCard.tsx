import { Card, CardBody } from '@nextui-org/react'
import { useTranslations } from 'next-intl'
import { PolicyArea, computePolicyAreaBudget } from '@/domain/models/program'

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
            <ul className="space-y-1 mb-3">
              {area.objectives.map((objective, index) => (
                <li key={index} className="text-sm text-white/80 flex items-center">
                  <span className="w-2 h-2 bg-white/50 rounded-full mr-2" />
                  {objective.label}
                </li>
              ))}
            </ul>
            <div className="mt-2 p-2 bg-white/5 rounded text-sm">
              <div className="flex justify-between">
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