'use client'
import React, { useState } from 'react'
import { Navbar, NavbarBrand, NavbarContent, Link, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react"
import { useTranslations } from 'next-intl'
import LoginModal from './LoginModal'
import { auth } from '../../infra/firebase/auth'
import Image from 'next/image'
import { useUser } from '../contexts/UserContext'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const t = useTranslations('home')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { user } = useUser()

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
    <div className="min-h-screen flex flex-col">
      <Navbar data-testid="top-bar" className="nav-blur">
        <NavbarBrand>
          <Link href="/" className="text-white flex items-center gap-3">
            <Image 
              src="/images/icon.svg" 
              alt="Neo Republic Logo" 
              width={32} 
              height={32} 
              className="rounded-lg"
            />
            <p className="font-bold text-xl">{t('appTitle')}</p>
          </Link>
        </NavbarBrand>
        <NavbarContent justify="end">
            {user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <div className="flex items-center gap-2 cursor-pointer" data-testid="user-menu-trigger">
                  <Avatar 
                    name={user.displayName || undefined}
                    src={user.profile?.avatar || undefined}
                    size="sm"
                  />
                  <span data-testid="user-name" className="text-lg text-white">
                    {user.displayName}
                  </span>
                </div>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="User menu"
                className="bg-primary-900/90 backdrop-blur-md text-white"
              >
                <DropdownItem 
                  key="logout" 
                  data-testid="logout-button"
                  className="text-danger-400 hover:text-danger-300" 
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
              className="bg-primary-700 hover:bg-primary-600"
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

      <div className="flex-grow relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 via-primary-800/75 to-primary-900/70 backdrop-blur-[2px]" />
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  )
} 