'use client'
import { useTranslations } from 'next-intl'

export default function CookiePolicy() {
  const t = useTranslations('cookies')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">{t('title')}</h1>
        <div className="prose prose-lg prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('introduction.title')}</h2>
            <p>{t('introduction.description')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('whatAreCookies.title')}</h2>
            <p>{t('whatAreCookies.description')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('typesOfCookies.title')}</h2>
            <p>{t('typesOfCookies.description')}</p>
            <ul className="list-disc pl-6 mt-4">
              <li>
                <strong>{t('typesOfCookies.items.essential.title')}</strong>
                <p>{t('typesOfCookies.items.essential.description')}</p>
              </li>
              <li>
                <strong>{t('typesOfCookies.items.functional.title')}</strong>
                <p>{t('typesOfCookies.items.functional.description')}</p>
              </li>
              <li>
                <strong>{t('typesOfCookies.items.analytics.title')}</strong>
                <p>{t('typesOfCookies.items.analytics.description')}</p>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('control.title')}</h2>
            <p>{t('control.description')}</p>
            <ul className="list-disc pl-6 mt-4">
              <li>{t('control.items.browser')}</li>
              <li>{t('control.items.settings')}</li>
              <li>{t('control.items.thirdParty')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('updates.title')}</h2>
            <p>{t('updates.description')}</p>
          </section>
        </div>
      </div>
    </div>
  )
} 