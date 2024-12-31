'use client'
import { updateDraftProgram } from '@/actions/programs/updateDraftProgram'
import { publishProgramForReview } from '@/actions/programs/publishProgramForReview'
import { Objective, PolicyArea, Program } from '@/domain/models/program'
import { Button, Card, CardBody, Input, Spinner, Textarea } from '@nextui-org/react'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { updateObjective } from '@/actions/programs/updateObjective'
import { addObjective } from '@/actions/programs/addObjective'
import { deleteObjective } from '@/actions/programs/deleteObjective'

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
          label: "text-black",
          input: "text-black",
          inputWrapper: "bg-white border-white/20 hover:bg-white/90",
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
          label: "text-black",
          input: "text-black",
          inputWrapper: "bg-white border-white/20 hover:bg-white/90",
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
  const t = useTranslations('programs.policyAreas')
  const isComplete = area.objectives.length > 0

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
          <ul className="space-y-1">
            {area.objectives.map((objective, index) => (
              <li key={index} className="text-sm text-white/80 flex items-center">
                <span className="w-2 h-2 bg-white/50 rounded-full mr-2" />
                {objective.label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-white/50 italic">
            No objectives yet
          </p>
        )}
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
            <p className="text-white/90 font-medium">{objective.label}</p>
            <p className="text-white/70 mt-2 text-sm">{objective.details}</p>
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

// Component for objective form
const ObjectiveForm = ({
  objective,
  onSave,
  onCancel
}: {
  objective?: Objective
  onSave: (objective: Objective) => void
  onCancel: () => void
}) => {
  const t = useTranslations('programs.form')
  const [label, setLabel] = useState(objective?.label || '')
  const [details, setDetails] = useState(objective?.details || '')
  const [revenue, setRevenue] = useState(objective?.budget.revenue.toString() || '')
  const [expenses, setExpenses] = useState(objective?.budget.expenses.toString() || '')

  const handleSave = () => {
    if (!label || !details || !revenue || !expenses) return

    onSave({
      label: label,
      details: details,
      budget: {
        revenue: Number(revenue),
        expenses: Number(expenses)
      }
    })
  }

  return (
    <Card className="w-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
      <CardBody className="p-4">
        <div className="space-y-4">
          <Textarea
            label={t('objective.label')}
            placeholder={t('objective.labelPlaceholder')}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            data-testid="objective-label-input"
            required
            minRows={2}
          />
          <Textarea
            label={t('objective.details')}
            placeholder={t('objective.detailsPlaceholder')}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            data-testid="objective-details-input"
            required
            minRows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label={t('objective.revenue')}
              placeholder={t('objective.revenuePlaceholder')}
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              data-testid="objective-revenue-input"
              required
            />
            <Input
              type="number"
              label={t('objective.expenses')}
              placeholder={t('objective.expensesPlaceholder')}
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              data-testid="objective-expenses-input"
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              color="danger"
              variant="light"
              onPress={onCancel}
              data-testid="cancel-objective-button"
            >
              {t('cancel')}
            </Button>
            <Button
              color="primary"
              onPress={handleSave}
              data-testid="save-objective-button"
              isDisabled={!label || !details || !revenue || !expenses}
            >
              {t('save')}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

// Component for selected area details
const SelectedAreaDetails = ({
  areaId,
  area,
  onAddObjective,
  onEditObjective,
  onRemoveObjective
}: {
  areaId: string
  area: PolicyArea
  onClose: () => void
  onAddObjective: (objective: Objective) => void
  onEditObjective: (objective: Objective, initialObjective: Objective) => void
  onRemoveObjective: (objective: Objective) => void
}) => {
  const t = useTranslations('programs')
  const [showObjectiveForm, setShowObjectiveForm] = useState(false)
  const [editingObjective, setEditingObjective] = useState<Objective | undefined>()

  const areaTitle = t(`policyAreas.${areaId}.title`)
  const areaDescription = t(`policyAreas.${areaId}.description`)
  const handleAddClick = () => {
    setEditingObjective(undefined)
    setShowObjectiveForm(true)
  }

  const handleEditClick = (objective: Objective) => {
    setEditingObjective(objective)
    setShowObjectiveForm(true)
  }

  const handleSaveObjective = (objective: Objective) => {
    if (editingObjective) {
      onEditObjective(objective, editingObjective)
    } else {
      onAddObjective(objective)
    }
    setShowObjectiveForm(false)
    setEditingObjective(undefined)
  }


  return (
    <div className="mt-8 bg-white/5 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-semibold text-white mb-2">{areaTitle}</h3>
          <p className="text-white/70">{areaDescription}</p>
        </div>
        <Button
          color="primary"
          onPress={handleAddClick}
          data-testid="add-objective-button"
          isDisabled={showObjectiveForm}
        >
          {t('form.addNewObjective')}
        </Button>
      </div>

      {showObjectiveForm && (
        <ObjectiveForm
          objective={editingObjective}
          onSave={handleSaveObjective}
          onCancel={() => {
            setShowObjectiveForm(false)
            setEditingObjective(undefined)
          }}
        />
      )}

      <div className="space-y-4">
        {area.objectives.map((objective, index) => (
          <ObjectiveCard
            key={index}
            objective={objective}
            onEdit={handleEditClick}
            onRemove={onRemoveObjective}
          />
        ))}
      </div>
    </div>
  )
}

export default function ProgramForm({ program: initialProgram, onSubmit }: ProgramFormProps) {
  const t = useTranslations('programs')
  const [program, setProgram] = useState(initialProgram)
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const selectedAreaRef = useRef<HTMLDivElement>(null)


  const sortedPolicyAreas = t('policyAreaKeys').split(',')

  const handleAreaSelect = (id: string) => {
    setSelectedArea(id)
    setTimeout(() => {
      selectedAreaRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)
  }

  const saveChanges = async (block: () => Promise<Program>) => {
    try {
      setIsSubmitting(true)
      const savedProgram = await block()
      setProgram(savedProgram)
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
    saveChanges(() => updateDraftProgram(program))
  }

  const handleAddObjective = (objective: Objective) => {
    if (!selectedArea) return


    saveChanges(() => addObjective({ programId: program.id, policyAreaId: selectedArea, objective }))
  }

  const handleEditObjective = async (objective: Objective, initialObjective: Objective) => {
    if (!selectedArea) return

    saveChanges(() => updateObjective({ programId: program.id, policyAreaId: selectedArea, objective, label: initialObjective.label }))
  }

  const handleRemoveObjective = (objective: Objective) => {
    if (!selectedArea) return

    saveChanges(() => deleteObjective({ programId: program.id, policyAreaId: selectedArea, objective }))
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
          <span className="text-sm text-white">{t('form.saving')}</span>
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-white">
          {t('form.editProgram')}
        </h1>
        <p className="text-xl text-white/80">
          {t('form.editProgramDescription')}
        </p>
      </div>

      <form className="space-y-8">
        <ProgramDetails
          program={program}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <div data-testid="policy-areas-section">
          <h2 className="text-2xl font-semibold mb-4 text-white">{t('form.policyAreas.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedPolicyAreas.map((id) => (
              <PolicyAreaCard
                key={id}
                id={id}
                area={program.policyAreas[id]}
                isSelected={selectedArea === id}
                onSelect={handleAreaSelect}
              />
            ))}
          </div>

          {selectedArea && (
            <div ref={selectedAreaRef}>
              <SelectedAreaDetails
                areaId={selectedArea}
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
              {t('form.publishDisabledTooltip')}
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
            {t('form.publishProgram')}
          </Button>
        </div>
      </form>
    </div>
  )
} 