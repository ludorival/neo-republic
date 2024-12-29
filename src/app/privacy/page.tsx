'use client'
import { useTranslations } from 'next-intl'

export default function PrivacyPolicy() {
  const t = useTranslations('privacy')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">{t('title')}</h1>
        <div className="prose prose-lg prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('dataCollection.title')}</h2>
            <p>{t('dataCollection.description')}</p>
            <ul className="list-disc pl-6 mt-4">
              <li>{t('dataCollection.items.personal')}</li>
              <li>{t('dataCollection.items.usage')}</li>
              <li>{t('dataCollection.items.technical')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('dataUse.title')}</h2>
            <p>{t('dataUse.description')}</p>
            <ul className="list-disc pl-6 mt-4">
              <li>{t('dataUse.items.service')}</li>
              <li>{t('dataUse.items.improvement')}</li>
              <li>{t('dataUse.items.communication')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('dataSecurity.title')}</h2>
            <p>{t('dataSecurity.description')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('userRights.title')}</h2>
            <p>{t('userRights.description')}</p>
            <ul className="list-disc pl-6 mt-4">
              <li>{t('userRights.items.access')}</li>
              <li>{t('userRights.items.rectification')}</li>
              <li>{t('userRights.items.deletion')}</li>
              <li>{t('userRights.items.portability')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('contact.title')}</h2>
            <p>{t('contact.description')}</p>
          </section>
        </div>
      </div>
    </div>
  )
} 