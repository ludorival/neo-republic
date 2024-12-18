'use client'
import React from 'react'
import { Navbar, NavbarBrand, NavbarContent, Button, Card, CardBody } from "@nextui-org/react"
import { useTranslations } from 'next-intl'

const Home = () => {
  const t = useTranslations('home')

  return (
    <main className="min-h-screen hero-gradient">
      <Navbar data-testid="top-bar" className="nav-blur">
        <NavbarBrand>
          <p className="font-bold text-xl">{t('appTitle')}</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <Button 
            data-testid="login-button"
            color="primary"
            variant="shadow"
            size="lg"
          >
            {t('login')}
          </Button>
        </NavbarContent>
      </Navbar>

      <div className="max-w-4xl mx-auto p-8">
        <Card className="glass-card">
          <CardBody 
            data-testid="project-description"
            className="space-y-8 p-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">{t('appTitle')}</h2>
              <p className="text-lg text-default-600">{t('description')}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">{t('keyFeatures')}:</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {['anonymous', 'comprehensive', 'financial', 'focus'].map((feature) => (
                  <Card key={feature} className="feature-card">
                    <CardBody className="p-4">
                      <p>{t(`features.${feature}`)}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  )
}

export default Home
