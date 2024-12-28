'use client'
import React, { useState } from 'react'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react"
import { useTranslations } from 'next-intl'
import LoginModal from './LoginModal'
import { auth } from '../../lib/firebase/auth'
import { useAuth } from '@/hooks/useAuth'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const t = useTranslations('home')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { currentUser } = useAuth()

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
    <>
      <Navbar data-testid="top-bar" className="nav-blur">
        <NavbarBrand>
          <Link href="/" color="foreground">
            <p className="font-bold text-xl">{t('appTitle')}</p>
          </Link>
        </NavbarBrand>
        <NavbarContent justify="center">
          <NavbarItem>
            <Link href="/about" color="foreground">
              About
            </Link>
          </NavbarItem>
        </NavbarContent>
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

      <main className="min-h-screen hero-gradient">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </>
  )
} 