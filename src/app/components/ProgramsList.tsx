'use client'
import { createDraftProgram } from '@/actions/programs/createDraftProgram'
import { Program } from '@/domain/models/program'
import { User } from '@/domain/models/user'
import { Card, CardBody, Spinner } from '@nextui-org/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import LoginModal from './LoginModal'


type ProgramsListProps = {
  programs?: Program[]
}

// Component to display program card
const ProgramCard = ({ program }: { program: Program }) => {
  return (
    <Card
      key={program.id}
      className="min-w-[300px] max-w-[300px] bg-white/10 backdrop-blur-sm"
      data-testid="program-card"
    >
      <CardBody className="p-4">
        <h3 
          className="text-xl font-semibold mb-2 text-white"
          data-testid="program-slogan"
        >
          {program.slogan}
        </h3>
        <p 
          className="text-white/80"
          data-testid="program-description"
        >
          {program.description}
        </p>
      </CardBody>
    </Card>
  )
}

// Component for the create/edit card
const ActionCard = ({ 
  user, 
  isCreating, 
  onCreateClick 
}: { 
  user: User | null, 
  isCreating: boolean,
  onCreateClick: (user: User | null) => void
}) => {
  const t = useTranslations('programs')
  const router = useRouter()

  if (user?.submittedProgram) {
    return (
      <Card
        isPressable
        isHoverable
        className="min-w-[300px] max-w-[300px] bg-white/10 backdrop-blur-sm hover:bg-white/20"
        onPress={() => router.push(`/programs/${user.submittedProgram}/edit`)}
        data-testid="edit-program-card"
      >
        <CardBody className="p-4 flex flex-col items-center justify-center h-full">
          <h3 className="text-xl font-semibold mb-2 text-white">
            {t('edit.title')}
          </h3>
          <p className="text-white/80 text-center">
            {t('edit.description')}
          </p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card
      isPressable
      isHoverable
      className="min-w-[300px] max-w-[300px] bg-white/10 backdrop-blur-sm hover:bg-white/20"
      onPress={() => onCreateClick(user)}
      data-testid="create-program-card"
    >
      <CardBody className="p-4 flex flex-col items-center justify-center h-full">
        {isCreating ? (
          <Spinner color="white" />
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-2 text-white">
              {t('create.title')}
            </h3>
            <p className="text-white/80 text-center">
              {t('create.description')}
            </p>
          </>
        )}
      </CardBody>
    </Card>
  )
}

export default function ProgramsList({ programs = [] }: ProgramsListProps) {
  const t = useTranslations('programs')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()
  const router = useRouter()
  const policyAreas = t('policyAreaKeys').split(',') // ['economy', 'social', 'education', 'infrastructure', 'environment', 'security'] as const


  const handleCreateProgramClick = async (user: User | null) => {
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }
    try {
      setIsCreating(true)
      setError(null)
      
      const program = await createDraftProgram({ 
        authorId: user.id,
        slogan: '',
        description: '',
        policyAreas: policyAreas
      });
      
      router.push(`/programs/${program.id}/edit`)
    } catch (error) {
      console.error('Failed to create draft program:', error);
      setError(t('create.error'))
    } finally {
      setIsCreating(false)
    }
  }

  const renderProgramsList = () => {
    if (programs.length === 0) {
      return (
        <div className="flex gap-4 overflow-x-auto pb-4">
          <div 
            data-testid="programs-empty"
            className="flex-1 text-center text-white/80 mt-8"
          >
            {t('empty')}
          </div>
          <ActionCard 
            user={user} 
            isCreating={isCreating} 
            onCreateClick={handleCreateProgramClick} 
          />
        </div>
      )
    }

    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
        <ActionCard 
          user={user} 
          isCreating={isCreating} 
          onCreateClick={handleCreateProgramClick} 
        />
      </div>
    )
  }

  return (
    <div data-testid="programs-list" className="relative">
      <div className="mb-8 text-center">
        <h2 data-testid="programs-header" className="text-3xl font-bold mb-3 text-white">
          {t('title')}
        </h2>
        <p data-testid="programs-description" className="text-white/80 max-w-2xl mx-auto">
          {t('description')}
        </p>
      </div>
      {error && (
        <div 
          className="mb-4 p-4 bg-danger-500/10 border border-danger-500/20 rounded-lg text-danger-500"
          data-testid="create-program-error"
        >
          {error}
        </div>
      )}
      {renderProgramsList()}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleCreateProgramClick}
      />
    </div>
  )
} 