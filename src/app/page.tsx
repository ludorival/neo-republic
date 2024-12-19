'use client'
import React from 'react'
import { Navbar, NavbarBrand, NavbarContent, Button, Card, CardBody } from "@nextui-org/react"
import { useTranslations } from 'next-intl'

const Home = () => {
  const t = useTranslations('home')

  return (
    <main className="min-h-screen">
      {/* Top Bar */}
      <Navbar data-testid="top-bar" className="shadow-sm">
        <NavbarBrand>
          <p className="font-bold text-inherit">{t('appTitle')}</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <Button 
            data-testid="login-button"
            color="primary"
            variant="flat"
          >
            {t('login')}
          </Button>
        </NavbarContent>
      </Navbar>

      {/* Project Description */}
      <div className="max-w-4xl mx-auto p-8">
        <Card>
          <CardBody 
            data-testid="project-description"
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold">{t('appTitle')}</h2>
            <p>{t('description')}</p>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{t('keyFeatures')}:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('features.anonymous')}</li>
                <li>{t('features.comprehensive')}</li>
                <li>{t('features.financial')}</li>
                <li>{t('features.focus')}</li>
              </ul>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  )
}

export default Home
