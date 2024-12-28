'use client'
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardBody, Button } from '@nextui-org/react'

const policyAreas = ['economy', 'education', 'environment', 'healthcare', 'social'] as const
type PolicyArea = typeof policyAreas[number]

export default function CreateProgramPage() {
  const t = useTranslations('programs.create')
  const [selectedAreas, setSelectedAreas] = useState<PolicyArea[]>([])
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const togglePolicyArea = (area: PolicyArea) => {
    setSelectedAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    )
  }

  const handleContinue = () => {
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(t('errors.required'))
  }

  if (showForm) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <form onSubmit={handleSubmit} data-testid="policy-area-form">
          {error && (
            <p data-testid="form-error" className="text-danger mb-4">
              {error}
            </p>
          )}
          <Button
            type="submit"
            data-testid="submit-program"
            color="primary"
            size="lg"
          >
            Submit
          </Button>
        </form>
      </div>
    )
  }

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

      <section data-testid="policy-areas-section">
        <h2 className="text-2xl font-semibold mb-4">{t('policyAreas.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {policyAreas.map(area => (
            <Card
              key={area}
              isPressable
              isHoverable
              onPress={() => togglePolicyArea(area)}
              className={selectedAreas.includes(area) ? 'selected border-primary border-2' : ''}
              data-testid="policy-area-card"
            >
              <CardBody className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {t(`policyAreas.${area}.title`)}
                </h3>
                <p className="text-default-500">
                  {t(`policyAreas.${area}.description`)}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <div className="mt-8 flex justify-end">
        <Button
          data-testid="continue-button"
          color="primary"
          size="lg"
          isDisabled={selectedAreas.length === 0}
          onPress={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  )
} 