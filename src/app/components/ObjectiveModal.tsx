'use client'
import { Objective } from '@/domain/models/program'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@nextui-org/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface ObjectiveModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (objective: Objective) => void
  objective?: Objective
}

export default function ObjectiveModal({ isOpen, onClose, onSave, objective }: ObjectiveModalProps) {
  const t = useTranslations('programs.form')
  const [description, setDescription] = useState(objective?.description || '')
  const [revenue, setRevenue] = useState(objective?.budget.revenue.toString() || '')
  const [expenses, setExpenses] = useState(objective?.budget.expenses.toString() || '')

  const handleSave = () => {
    if (!description || !revenue || !expenses) return

    onSave({
      description,
      budget: {
        revenue: Number(revenue),
        expenses: Number(expenses)
      }
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} data-testid="objective-modal">
      <ModalContent>
        <ModalHeader>{objective ? t('editObjective') : t('addObjective')}</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Textarea
              label={t('objective.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="objective-description-input"
              required
            />
            <Input
              type="number"
              label={t('objective.revenue')}
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              data-testid="objective-revenue-input"
              required
            />
            <Input
              type="number"
              label={t('objective.expenses')}
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              data-testid="objective-expenses-input"
              required
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose} data-testid="cancel-objective-button">
            {t('cancel')}
          </Button>
          <Button color="primary" onPress={handleSave} data-testid="save-objective-button">
            {t('save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
} 