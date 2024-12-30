'use client'
import { updateDraftProgram } from '@/actions/programs/updateDraftProgram'
import { publishProgramForReview } from '@/actions/programs/publishProgramForReview'
import { Objective, PolicyArea, Program } from '@/domain/models/program'
import { Button, Card, CardBody, Input, Spinner, Textarea } from '@nextui-org/react'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import ObjectiveModal from './ObjectiveModal'

type ProgramFormProps = {
  program: Program
  onSubmit?: (program: Program) => void
}

// Component for program details section
const ProgramDetails = ({
  program,
  onChange,
  onBlur
}: {
  program: Program
  onChange: (field: keyof Program) => (value: string) => void
  onBlur: () => void
}) => {
  const t = useTranslations('programs.form')

  return (
    <div className="space-y-4">
      <Input
        label={t('programSlogan')}
        placeholder={t('sloganPlaceholder')}
        value={program.slogan}
        onChange={(e) => onChange('slogan')(e.target.value)}
        onBlur={onBlur}
        variant="bordered"
        classNames={{
          label: "text-white",
          input: "text-white",
          inputWrapper: "bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20",
        }}
        data-testid="program-slogan-input"
        required
      />
      
      <Textarea
        label={t('programDescription')}
        placeholder={t('descriptionPlaceholder')}
        value={program.description}
        onChange={(e) => onChange('description')(e.target.value)}
        onBlur={onBlur}
        variant="bordered"
        classNames={{
          label: "text-white",
          input: "text-white",
          inputWrapper: "bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20",
        }}
        minRows={3}
        data-testid="program-description-input"
        required
      />
    </div>
  )
}

// Component for policy area card
const PolicyAreaCard = ({
  id,
  area,
  isSelected,
  onSelect
}: {
  id: string
  area: PolicyArea
  isSelected: boolean
  onSelect: (id: string) => void
}) => {
  const isComplete = area.objectives.length > 0

  return (
    <Card
      isPressable
      isHoverable
      onPress={() => onSelect(id)}
      className={`bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/20 ${isComplete ? 'border-success border-2' : ''} ${isSelected ? 'ring-2 ring-primary' : ''}`}
      data-testid="policy-area-card"
    >
      <CardBody className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-white">
            {area.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/80">
              {area.objectives.length} objectives
            </span>
            <div 
              data-testid={isComplete ? "policy-area-status-complete" : "policy-area-status-incomplete"}
              className={`rounded-full w-3 h-3 ${isComplete ? 'bg-success' : 'bg-white/30'}`}
            />
          </div>
        </div>
        <p className="text-white/70">
          {area.description}
        </p>
      </CardBody>
    </Card>
  )
}

// Component for objective card
const ObjectiveCard = ({
  objective,
  onEdit,
  onRemove
}: {
  objective: Objective
  onEdit: (objective: Objective) => void
  onRemove: (objective: Objective) => void
}) => {
  const t = useTranslations('programs.form')

  return (
    <Card className="w-full bg-white/10 backdrop-blur-sm border border-white/20" data-testid="policy-objective-card">
      <CardBody className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <p className="text-white/90">{objective.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              color="primary"
              variant="light"
              size="sm"
              onPress={() => onEdit(objective)}
              data-testid="edit-objective-button"
            >
              {t('edit')}
            </Button>
            <Button
              color="danger"
              variant="light"
              size="sm"
              onPress={() => onRemove(objective)}
              data-testid="remove-objective-button"
            >
              {t('remove')}
            </Button>
          </div>
        </div>
        <div className="mt-2 p-2 bg-white/5 rounded">
          <div className="flex justify-between">
            <p className="text-success-400">
              {t('revenue')}: +${objective.budget.revenue}
            </p>
            <p className="text-danger-400">
              {t('expense')}: -${objective.budget.expenses}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

// Component for selected area details
const SelectedAreaDetails = ({
  area,
  onClose,
  onAddObjective,
  onEditObjective,
  onRemoveObjective
}: {
  area: PolicyArea
  onClose: () => void
  onAddObjective: () => void
  onEditObjective: (objective: Objective) => void
  onRemoveObjective: (objective: Objective) => void
}) => {
  const t = useTranslations('programs.form')

  return (
    <div className="mt-8 border-t border-white/20 pt-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 
            data-testid="policy-area-title"
            className="text-2xl font-semibold text-white"
          >
            {area.title}
          </h2>
          <Button
            color="default"
            variant="light"
            onPress={onClose}
            data-testid="cancel-button"
            size="sm"
            className="text-white"
          >
            {t('close')}
          </Button>
        </div>
        <p className="text-white/70">
          {area.description}
        </p>
      </div>

      <div className="mb-8">
        <Button
          color="primary"
          onPress={onAddObjective}
          data-testid="add-objective-button"
        >
          {t('addNewObjective')}
        </Button>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">{t('policyPoints')}</h3>
          <div className="text-white/80">
            {area.objectives.length} {t('pointsAdded')}
          </div>
        </div>
        {area.objectives.map((objective, index) => (
          <ObjectiveCard
            key={index}
            objective={objective}
            onEdit={onEditObjective}
            onRemove={onRemoveObjective}
          />
        ))}
      </div>
    </div>
  )
}

export default function ProgramForm({ program: initialProgram, onSubmit }: ProgramFormProps) {
  const t = useTranslations('programs.form')
  const [program, setProgram] = useState(initialProgram)
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false)
  const [editingObjective, setEditingObjective] = useState<Objective | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const selectedAreaRef = useRef<HTMLDivElement>(null)

  // Helper function to sort policy areas by position
  const sortedPolicyAreas = () => {
    return Object.entries(program.policyAreas)
      .sort(([, a], [, b]) => a.position - b.position);
  }

  const handleAreaSelect = (id: string) => {
    setSelectedArea(id)
    setTimeout(() => {
      selectedAreaRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)
  }

  const saveChanges = async (updatedProgram: Program) => {
    try {
      setIsSubmitting(true)
      const savedProgram = await updateDraftProgram(updatedProgram)
      onSubmit?.(savedProgram)
    } catch (error) {
      console.error('Failed to update program:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof Program) => (value: string) => {
    const updatedProgram = {
      ...program,
      [field]: value,
      updatedAt: new Date()
    }
    setProgram(updatedProgram)
  }

  const handleBlur = () => {
    saveChanges(program)
  }

  const handleAddObjective = () => {
    setEditingObjective(undefined)
    setIsObjectiveModalOpen(true)
  }

  const handleEditObjective = (objective: Objective) => {
    setEditingObjective(objective)
    setIsObjectiveModalOpen(true)
  }

  const handleSaveObjective = (objective: Objective) => {
    if (!selectedArea) return

    const area = program.policyAreas[selectedArea]
    if (!area) return

    const objectives = editingObjective
      ? area.objectives.map(obj => 
          obj.description === editingObjective.description ? objective : obj
        )
      : [...area.objectives, objective]

    const updatedProgram = {
      ...program,
      policyAreas: {
        ...program.policyAreas,
        [selectedArea]: {
          ...area,
          objectives
        }
      },
      updatedAt: new Date()
    }

    setProgram(updatedProgram)
    saveChanges(updatedProgram)
    setIsObjectiveModalOpen(false)
  }

  const handleRemoveObjective = (objective: Objective) => {
    if (!selectedArea) return

    const updatedProgram = { ...program }
    const area = updatedProgram.policyAreas[selectedArea]
    if (!area) return

    updatedProgram.policyAreas[selectedArea] = {
      ...area,
      objectives: area.objectives.filter(o => o.description !== objective.description)
    }
    updatedProgram.updatedAt = new Date()

    setProgram(updatedProgram)
    saveChanges(updatedProgram)
  }

  const isAreaComplete = (area: PolicyArea) => area.objectives.length > 0
  const canPublish = Object.values(program.policyAreas).every(isAreaComplete)

  const handlePublish = async () => {
    try {
      setIsSubmitting(true)
      const publishedProgram = await publishProgramForReview(program)
      onSubmit?.(publishedProgram)
    } catch (error) {
      console.error('Failed to publish program:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative p-0 m-0">
      {isSubmitting && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white/10 backdrop-blur-sm p-2 rounded-lg shadow-lg">
          <Spinner size="sm" />
          <span className="text-sm text-white">{t('saving')}</span>
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-white">
          {t('editProgram')}
        </h1>
        <p className="text-xl text-white/80">
          {t('editProgramDescription')}
        </p>
      </div>

      <form className="space-y-8">
        <ProgramDetails
          program={program}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <div data-testid="policy-areas-section">
          <h2 className="text-2xl font-semibold mb-4 text-white">{t('policyAreas.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedPolicyAreas().map(([id, area]) => (
              <PolicyAreaCard
                key={id}
                id={id}
                area={area}
                isSelected={selectedArea === id}
                onSelect={handleAreaSelect}
              />
            ))}
          </div>

          {selectedArea && (
            <div ref={selectedAreaRef}>
              <SelectedAreaDetails
                area={program.policyAreas[selectedArea]}
                onClose={() => setSelectedArea(null)}
                onAddObjective={handleAddObjective}
                onEditObjective={handleEditObjective}
                onRemoveObjective={handleRemoveObjective}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end items-center gap-4">
          {!canPublish && (
            <p className="text-sm text-danger-400" data-testid="publish-disabled-message">
              {t('publishDisabledTooltip')}
            </p>
          )}
          <Button
            type="button"
            color="success"
            data-testid="publish-program-button"
            isLoading={isSubmitting}
            onPress={handlePublish}
            isDisabled={!canPublish}
          >
            {t('publishProgram')}
          </Button>
        </div>

        <ObjectiveModal
          isOpen={isObjectiveModalOpen}
          onClose={() => setIsObjectiveModalOpen(false)}
          onSave={handleSaveObjective}
          objective={editingObjective}
        />
      </form>
    </div>
  )
} 