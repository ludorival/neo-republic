'use client'
import { Card, CardBody } from "@nextui-org/react"
import { useTranslations } from 'next-intl'

export default function About() {
  const t = useTranslations('home')

  const features = [
    { key: 'anonymous', icon: '🔒' },
    { key: 'comprehensive', icon: '📋' },
    { key: 'financial', icon: '💰' },
    { key: 'focus', icon: '🎯' }
  ]

  return (
      <div data-testid="project-description" className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{t('appTitle')}</h1>
        <p className="text-xl mb-12">{t('description')}</p>

        <h2 className="text-2xl font-semibold mb-6">{t('keyFeatures')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(({ key, icon }) => (
            <Card key={key} className="feature-card">
              <CardBody className="flex flex-row items-center gap-4">
                <div className="text-3xl">{icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{t(`features.${key}`)}</h3>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
  )
} 