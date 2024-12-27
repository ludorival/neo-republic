'use client'
import React, { useState, useEffect } from 'react'
import { Navbar, NavbarBrand, NavbarContent, Button, Card, CardBody, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react"
import { useTranslations } from 'next-intl'
import LoginModal from './components/LoginModal'
import { auth } from '@/lib/firebase/auth'
import { User } from 'firebase/auth'

const Home = () => {
  const t = useTranslations('home')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const handleLoginClick = () => {
    setIsLoginModalOpen(true)
  }

  const handleLogoutClick = async () => {
    try {
      await auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <main className="min-h-screen hero-gradient">
      <Navbar data-testid="top-bar" className="nav-blur">
        <NavbarBrand>
          <p className="font-bold text-xl">{t('appTitle')}</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          {currentUser ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <div className="flex items-center gap-2 cursor-pointer" data-testid="user-menu-trigger">
                  <Avatar 
                    name={currentUser.displayName || undefined}
                    src={currentUser.photoURL || undefined}
                    size="sm"
                  />
                  <span data-testid="user-name" className="text-lg">
                    {currentUser.displayName}
                  </span>
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu">
                <DropdownItem 
                  key="logout" 
                  data-testid="logout-button"
                  className="text-danger" 
                  color="danger"
                  onPress={handleLogoutClick}
                >
                  {t('logout')}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button 
              data-testid="login-button"
              color="primary"
              variant="shadow"
              size="lg"
              onPress={handleLoginClick}
            >
              {t('login')}
            </Button>
          )}
        </NavbarContent>
      </Navbar>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

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
