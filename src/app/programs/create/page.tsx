'use client'
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardBody, Button, Input, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { PolicyArea as PolicyAreaType, Objective, Budget } from '@/types/program'

const policyAreas = [
  'economy',
  'social',
  'education',
  'infrastructure',
  'environment',
  'security'
] as const
type PolicyArea = typeof policyAreas[number]

interface PolicyAreaFormData {
  objectives: Objective[];
  implementation?: {
    timeline: string;
    milestones: string[];
    keyMetrics: string[];
  };
}

export default function CreateProgramPage() {
  const t = useTranslations('programs.create')
  const [selectedArea, setSelectedArea] = useState<PolicyArea | null>(null)
  const [policyData, setPolicyData] = useState<Record<PolicyArea, PolicyAreaFormData | null>>(() => 
    Object.fromEntries(policyAreas.map(area => [area, null])) as Record<PolicyArea, PolicyAreaFormData | null>
  )
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingObjectiveId, setEditingObjectiveId] = useState<string | null>(null)
  const [currentObjective, setCurrentObjective] = useState<Partial<Objective>>({
    description: '',
    budget: {
      revenue: 0,
      expenses: 0
    }
  })
  const [programDetails, setProgramDetails] = useState({
    slogan: '',
    description: ''
  })

  const handleAreaClick = (area: PolicyArea) => {
    setSelectedArea(area)
    // Load existing objectives if any
    if (policyData[area]) {
      setObjectives(policyData[area]!.objectives)
    } else {
      setObjectives([])
    }
  }

  const handleAddObjectiveClick = () => {
    setEditingObjectiveId(null)
    setCurrentObjective({
      description: '',
      budget: {
        revenue: 0,
        expenses: 0
      }
    })
    setIsModalOpen(true)
  }

  const handleEditObjectiveClick = (objective: Objective) => {
    setEditingObjectiveId(objective.id ?? null)
    setCurrentObjective({
      description: objective.description,
      budget: {
        revenue: objective.budget.revenue,
        expenses: objective.budget.expenses
      }
    })
    setIsModalOpen(true)
  }

  const handleSaveObjective = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentObjective.description) return

    const newObjective: Objective = {
      id: editingObjectiveId ?? crypto.randomUUID(),
      description: currentObjective.description,
      budget: currentObjective.budget as Budget
    }

    const newObjectives = editingObjectiveId
      ? objectives.map(obj => obj.id === editingObjectiveId ? newObjective : obj)
      : [...objectives, newObjective]

    setObjectives(newObjectives)

    // Automatically save the policy area data
    if (selectedArea) {
      setPolicyData(prev => ({
        ...prev,
        [selectedArea]: {
          objectives: newObjectives,
          implementation: {
            timeline: '',
            milestones: [],
            keyMetrics: []
          }
        }
      }))
    }

    setIsModalOpen(false)
    setEditingObjectiveId(null)
  }

  const handleRemoveObjective = (id: string) => {
    const newObjectives = objectives.filter(obj => obj.id !== id)
    setObjectives(newObjectives)

    // Update policy data
    if (selectedArea) {
      setPolicyData(prev => ({
        ...prev,
        [selectedArea]: {
          objectives: newObjectives,
          implementation: {
            timeline: '',
            milestones: [],
            keyMetrics: []
          }
        }
      }))
    }
  }

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
  }

  const handlePublish = () => {
    // TODO: Implement publish functionality
  }

  const handleProgramDetailsChange = (field: 'slogan' | 'description', value: string) => {
    setProgramDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isAllComplete = Object.values(policyData).every(area => area?.objectives.length ?? 0 > 0)
  const isProgramDetailsValid = programDetails.slogan.trim() !== '' && programDetails.description.trim() !== ''

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 
        data-testid="create-program-title"
        className="text-4xl font-bold mb-4"
      >
        {t('title')}
      </h1>
      <p 
        data-testid="create-program-description"
        className="text-xl text-default-600 mb-8"
      >
        {t('description')}
      </p>

      <section className="mb-8">
        <Card>
          <CardBody className="space-y-4">
            <Input
              label={t('form.programSlogan')}
              placeholder={t('form.sloganPlaceholder')}
              value={programDetails.slogan}
              onChange={(e) => handleProgramDetailsChange('slogan', e.target.value)}
              required
              data-testid="program-slogan-input"
            />
            <Textarea
              label={t('form.programDescription')}
              placeholder={t('form.descriptionPlaceholder')}
              value={programDetails.description}
              onChange={(e) => handleProgramDetailsChange('description', e.target.value)}
              required
              data-testid="program-description-input"
            />
          </CardBody>
        </Card>
      </section>

      <section data-testid="policy-areas-section" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t('policyAreas.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {policyAreas.map(area => {
            const areaData = policyData[area]
            const isComplete = (areaData?.objectives.length ?? 0) > 0
            const isSelected = selectedArea === area
            return (
              <Card
                key={area}
                isPressable
                isHoverable
                onPress={() => handleAreaClick(area)}
                className={`${isComplete ? 'border-success border-2' : ''} ${isSelected ? 'ring-2 ring-primary' : ''}`}
                data-testid="policy-area-card"
              >
                <CardBody className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">
                      {t(`policyAreas.${area}.title`)}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-default-500">
                        {areaData?.objectives.length ?? 0} objectives
                      </span>
                      <div 
                        data-testid={isComplete ? "policy-area-status-complete" : "policy-area-status-incomplete"}
                        className={`rounded-full w-3 h-3 ${isComplete ? 'bg-success' : 'bg-default-200'}`}
                      />
                    </div>
                  </div>
                  <p className="text-default-500">
                    {t(`policyAreas.${area}.description`)}
                  </p>
                </CardBody>
              </Card>
            )
          })}
        </div>
      </section>

      {selectedArea && (
        <section className="mt-8 border-t pt-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 
                data-testid="policy-area-title"
                className="text-2xl font-semibold"
              >
                {t(`policyAreas.${selectedArea}.title`)}
              </h2>
              <Button
                color="default"
                variant="light"
                onPress={() => setSelectedArea(null)}
                data-testid="cancel-button"
                size="sm"
              >
                {t('form.close')}
              </Button>
            </div>
            <p className="text-default-600">
              {t(`policyAreas.${selectedArea}.description`)}
            </p>
          </div>

          <div className="mb-8">
            <Button
              color="primary"
              onPress={handleAddObjectiveClick}
              data-testid="add-objective-button"
              isDisabled={!isProgramDetailsValid}
            >
              {t('form.addNewPoint')}
            </Button>
          </div>

          {/* Objectives list */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t('form.policyPoints')}</h3>
              <div className="text-default-600">
                {objectives.length} {t('form.pointsAdded')}
              </div>
            </div>
            {objectives.map(objective => (
              <Card key={objective.id} className="w-full" data-testid="policy-objective-card">
                <CardBody className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="text-default-600">{objective.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        color="primary"
                        variant="light"
                        size="sm"
                        isIconOnly
                        onPress={() => handleEditObjectiveClick(objective)}
                        data-testid="edit-objective-button"
                        aria-label={t('form.edit')}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        color="danger"
                        variant="light"
                        size="sm"
                        isIconOnly
                        onPress={() => handleRemoveObjective(objective.id!)}
                        data-testid="remove-objective-button"
                        aria-label={t('form.remove')}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 p-2 bg-default-100 rounded">
                    <div className="flex justify-between">
                      <p className="text-success">
                        {t('form.revenue')}: +${objective.budget.revenue}
                      </p>
                      <p className="text-danger">
                        {t('form.expense')}: -${objective.budget.expenses}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingObjectiveId(null)
        }}
        data-testid="objective-modal"
      >
        <ModalContent>
          <form onSubmit={handleSaveObjective}>
            <ModalHeader>
              {editingObjectiveId ? t('form.editPoint') : t('form.addNewPoint')}
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Textarea
                  label={t('form.description')}
                  value={currentObjective.description}
                  onChange={(e) => setCurrentObjective(prev => ({ ...prev, description: e.target.value }))}
                  required
                  data-testid="objective-description-input"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    label={t('form.revenue')}
                    value={currentObjective.budget?.revenue.toString()}
                    onChange={(e) => setCurrentObjective(prev => ({
                      ...prev,
                      budget: { ...prev.budget!, revenue: parseFloat(e.target.value) }
                    }))}
                    required
                    data-testid="objective-revenue-input"
                  />
                  <Input
                    type="number"
                    label={t('form.expense')}
                    value={currentObjective.budget?.expenses.toString()}
                    onChange={(e) => setCurrentObjective(prev => ({
                      ...prev,
                      budget: { ...prev.budget!, expenses: parseFloat(e.target.value) }
                    }))}
                    required
                    data-testid="objective-expenses-input"
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={() => {
                  setIsModalOpen(false)
                  setEditingObjectiveId(null)
                }}
                data-testid="cancel-objective-button"
              >
                {t('form.close')}
              </Button>
              <Button
                color="primary"
                type="submit"
                data-testid="save-objective-button"
              >
                {editingObjectiveId ? t('form.save') : t('form.addPoint')}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <div className="mt-8 flex justify-end gap-4">
        <Button
          data-testid="save-draft-button"
          color="default"
          onPress={handleSaveDraft}
        >
          {t('form.saveDraft')}
        </Button>
        {isAllComplete && (
          <Button
            data-testid="publish-program-button"
            color="success"
            onPress={handlePublish}
          >
            {t('form.publishProgram')}
          </Button>
        )}
      </div>
    </div>
  )
} 