import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Spinner } from "@nextui-org/react"
import { useTranslations } from 'next-intl'
import { auth } from '@/infra/firebase/auth'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const LoginModal = ({ isOpen, onClose, onSuccess }: LoginModalProps) => {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      await auth.signInWithGoogle()
      onClose()
      onSuccess?.()
    } catch (error) {
      console.error('Authentication error:', error)
      setError(t('home.authError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal 
      data-testid="login-modal"
      isOpen={isOpen} 
      onClose={onClose}
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1" data-testid="login-modal-title">
          {t('auth.loginRequired')}
        </ModalHeader>
        <ModalBody className="py-6">
          <p data-testid="login-modal-message" className="text-default-500 mb-4">
            {t('auth.loginToCreate')}
          </p>
          {error && (
            <p className="text-danger text-center mb-4" data-testid="error-message">
              {error}
            </p>
          )}
          <Button
            data-testid="google-signin-button"
            color="default"
            variant="bordered"
            size="lg"
            className="w-full"
            onPress={handleGoogleSignIn}
            isDisabled={isLoading}
          >
            {isLoading ? (
              <Spinner size="sm" />
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {isLoading ? t('home.signingIn') : t('home.continueWithGoogle')}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default LoginModal 