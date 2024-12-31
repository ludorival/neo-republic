'use client'
import React, { useEffect, useState } from 'react'
import { Program } from '@/domain/models/program'
import ProgramsList from './ProgramsList'
import { useTranslations } from 'next-intl'
import Countdown from './Countdown'
import { Button } from '@nextui-org/react'
import Footer from './Footer'

type HomePageProps = {
  programs?: Program[]
}

export default function HomePage({ programs = [] }: HomePageProps) {
  const t = useTranslations('home')
  const [scrollY, setScrollY] = useState(0)

  const submissionDeadline = new Date('2025-05-01')
  const electionDay = new Date('2025-06-01')

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const SectionBackground = () => (
    <div className="absolute inset-0 bg-gradient-to-b from-primary-900/60 to-primary-800/40" />
  )

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* Fixed background images with parallax effect */}
      <div className="fixed inset-0 w-full h-full">
        <div 
          className="absolute inset-0 bg-[url('/images/parliament.jpg')] bg-cover bg-center"
          style={{
            transform: `translate3d(0, ${scrollY * 0.3}px, 0)`,
            opacity: 0.2,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950 opacity-75" />
      </div>

      <main className="flex-grow relative">
        {/* Hero Section with Parallax */}
        <section className="min-h-[90vh] relative flex items-center justify-center w-full">
          <div 
            className="absolute inset-0 bg-[url('/images/democracy.jpg')] bg-cover bg-center"
            style={{
              transform: `translate3d(0, ${scrollY * 0.5}px, 0)`,
              opacity: 0.7,
            }}
          />
          <SectionBackground />
          <div 
            className="container mx-auto px-4 text-center relative text-white"
            style={{
              transform: `translate3d(0, ${scrollY * 0.2}px, 0)`,
            }}
          >
            <h1 
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{
                transform: `translate3d(0, ${-scrollY * 0.1}px, 0)`,
              }}
            >
              {t('hero.title')}
            </h1>
            <p 
              className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
              style={{
                transform: `translate3d(0, ${-scrollY * 0.05}px, 0)`,
              }}
            >
              {t('hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="py-16 relative w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 via-primary-800/75 to-primary-900/70 backdrop-blur-[2px]" />
          <div className="container mx-auto px-4 relative">
            <div className="grid md:grid-cols-2 gap-8">
              <Countdown 
                targetDate={submissionDeadline}
                label={t('countdown.submission')}
              />
              <Countdown 
                targetDate={electionDay}
                label={t('countdown.election')}
              />
            </div>
          </div>
        </section>

        {/* Programs List Section */}
        <section className="py-16 relative w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 via-primary-800/75 to-primary-900/70 backdrop-blur-[2px]" />
          <div className="container mx-auto px-4 relative">
            <ProgramsList programs={programs} />
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 relative w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 via-primary-800/75 to-primary-900/70 backdrop-blur-[2px]" />
          <div className="container mx-auto px-4 relative">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">{t('howItWorks.title')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-white shadow-lg">
                <h3 className="text-xl font-semibold mb-4">{t('howItWorks.propose.title')}</h3>
                <p className="mb-4">{t('howItWorks.propose.description')}</p>
              </div>
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-white shadow-lg">
                <h3 className="text-xl font-semibold mb-4">{t('howItWorks.validate.title')}</h3>
                <p className="mb-4">{t('howItWorks.validate.description')}</p>
                <Button 
                  color="primary"
                  href="/experts/apply"
                  as="a"
                >
                  {t('howItWorks.validate.apply')}
                </Button>
              </div>
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-white shadow-lg">
                <h3 className="text-xl font-semibold mb-4">{t('howItWorks.vote.title')}</h3>
                <p className="mb-4">{t('howItWorks.vote.description')}</p>
              </div>
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-white shadow-lg">
                <h3 className="text-xl font-semibold mb-4">{t('howItWorks.govern.title')}</h3>
                <p className="mb-4">{t('howItWorks.govern.description')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section with Parallax */}
        <section className="py-16 relative min-h-[60vh] w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 via-primary-800/75 to-primary-900/70 backdrop-blur-[2px]" />
          <div className="container mx-auto px-4 relative text-white">
            <h2 className="text-4xl font-bold text-center mb-8">{t('about.title')}</h2>
            <p className="text-lg max-w-3xl mx-auto text-center mb-16 text-white/90">
              {t('about.description')}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors shadow-lg">
                <h4 className="font-semibold mb-2">{t('about.goals.focus')}</h4>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors shadow-lg">
                <h4 className="font-semibold mb-2">{t('about.goals.transparency')}</h4>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors shadow-lg">
                <h4 className="font-semibold mb-2">{t('about.goals.participation')}</h4>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors shadow-lg">
                <h4 className="font-semibold mb-2">{t('about.goals.quality')}</h4>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
} 