'use client'
import React, { useState } from 'react'
import { Navbar, NavbarBrand, NavbarContent, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Spinner } from "@nextui-org/react"
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
  const { user, isLoading } = useUser()

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
          {isLoading ? (
            <div data-testid="auth-loading" className="flex items-center">
              <Spinner size="sm" color="white" className="opacity-50" />
            </div>
          ) : user ? (
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
            <Link
              data-testid="login-button"
              className="text-lg text-white hover:text-primary-300 transition-colors cursor-pointer"
              onPress={handleLoginClick}
            >
              {t('login')}
            </Link>
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