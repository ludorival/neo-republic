'use client'
import { useTranslations } from 'next-intl'

export default function TermsOfService() {
  const t = useTranslations('terms')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">{t('title')}</h1>
        <div className="prose prose-lg prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('acceptance.title')}</h2>
            <p>{t('acceptance.description')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('userConduct.title')}</h2>
            <p>{t('userConduct.description')}</p>
            <ul className="list-disc pl-6 mt-4">
              <li>{t('userConduct.items.respect')}</li>
              <li>{t('userConduct.items.content')}</li>
              <li>{t('userConduct.items.security')}</li>
              <li>{t('userConduct.items.accuracy')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('content.title')}</h2>
            <p>{t('content.description')}</p>
            <ul className="list-disc pl-6 mt-4">
              <li>{t('content.items.ownership')}</li>
              <li>{t('content.items.license')}</li>
              <li>{t('content.items.removal')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('liability.title')}</h2>
            <p>{t('liability.description')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('termination.title')}</h2>
            <p>{t('termination.description')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('changes.title')}</h2>
            <p>{t('changes.description')}</p>
          </section>
        </div>
      </div>
    </div>
  )
} 