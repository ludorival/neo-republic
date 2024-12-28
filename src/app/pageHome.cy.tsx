import React from 'react'
import Home from './page'
import { auth } from '@/lib/firebase/auth'
import { Program } from '@/types/program'
import messages from '../../messages/fr.json'

describe('<Home />', () => {
  let stubSignInWithGoogle: sinon.SinonStub
  beforeEach(() => {
    // Create a stub for signInWithGoogle
    stubSignInWithGoogle = cy.stub(auth, 'signInWithGoogle')
      .as('signInWithGoogle')
      .returns(Promise.resolve())
  })

  it('renders top bar with navigation and login button', () => {
    cy.mount(<Home programs={[]} />)
    
    cy.get('[data-testid="top-bar"]').should('exist')
    cy.get('a').contains('About').should('exist').should('have.attr', 'href', '/about')
    cy.get('[data-testid="login-button"]')
      .should('exist')
      .should('have.text', 'Connexion')
      .should('be.visible')
  })

  it('opens login modal when clicking login button', () => {
    cy.mount(<Home programs={[]} />)
    
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="login-modal"]')
      .should('exist')
      .should('be.visible')
    cy.get('[data-testid="google-signin-button"]')
      .should('exist')
      .should('be.visible')
  })

  it('calls Google sign in when clicking Google button', () => {
    stubSignInWithGoogle.resolves()
    cy.mount(<Home programs={[]} />)
    
    // Open modal and click Google sign-in button
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="google-signin-button"]').click()
    
    // Verify the auth method was called
    cy.get('@signInWithGoogle').should('have.been.calledOnce')
  })

  it('shows error message when Google sign in fails', () => {
    // Update stub to reject with error
    stubSignInWithGoogle.rejects(new Error('Authentication failed'))
      
    cy.mount(<Home programs={[]} />)
    
    // Open modal and click Google sign-in button
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="google-signin-button"]').click()
    
    // Verify error message is shown
    cy.get('[data-testid="error-message"]')
      .should('exist')
      .should('be.visible')
      .should('have.text', 'Échec de l\'authentification. Veuillez réessayer.')
  })

  it('displays user name when already authenticated', () => {
    // Mock authenticated user with profile picture
    const mockUser = {
      displayName: 'John Doe',
      email: 'john@example.com',
      uid: '123',
      photoURL: 'https://example.com/profile.jpg'
    }
    cy.stub(auth, 'onAuthStateChanged').callsFake(callback => {
      callback(mockUser)
      return () => {}
    })

    cy.mount(<Home programs={[]} />)
    
    // Verify login button is replaced with user name
    cy.get('[data-testid="login-button"]').should('not.exist')
    cy.get('[data-testid="user-name"]')
      .should('exist')
      .should('be.visible')
      .should('have.text', 'John Doe')
    
    // Verify profile picture is displayed
    cy.get('img[alt="John Doe"]')
      .should('exist')
      .should('have.attr', 'src', 'https://example.com/profile.jpg')
  })

  it('allows authenticated user to logout', () => {
    // Mock authenticated user
    const mockUser = {
      displayName: 'John Doe',
      email: 'john@example.com',
      uid: '123',
      photoURL: null
    }
    cy.stub(auth, 'onAuthStateChanged').callsFake(callback => {
      callback(mockUser)
      return () => {}
    })
    // Stub the signOut method
    cy.stub(auth, 'signOut').as('signOut').resolves()

    cy.mount(<Home programs={[]} />)
    
    // Verify user menu is shown
    cy.get('[data-testid="user-menu-trigger"]')
      .should('exist')
      .should('be.visible')
      .click()
    
    // Click logout button in dropdown
    cy.get('[data-testid="logout-button"]')
      .should('be.visible')
      .click()
    
    // Verify signOut was called
    cy.get('@signOut').should('have.been.calledOnce')
  })

  describe('Program Cards List', () => {
    const mockPrograms: Program[] = [
      {
        id: '1',
        status: 'published' as const,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        authorId: 'hidden',
        policyAreas: {
          economy: {
            id: 'economy',
            title: 'Economic Reform',
            description: 'Comprehensive economic reform plan',
            objectives: ['Reduce inflation', 'Create jobs'],
            budget: [],
            implementation: {
              timeline: '2024-2025',
              milestones: ['Q1: Policy draft', 'Q2: Implementation'],
              keyMetrics: ['Inflation rate', 'Employment rate']
            }
          }
        },
        financialValidation: {
          totalBudget: 1000000,
          isBalanced: true,
          reviewComments: [],
        },
        metrics: {
          publicSupport: 85,
          feasibilityScore: 90,
          votes: 150
        }
      },
      {
        id: '2',
        status: 'published' as const,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        authorId: 'hidden',
        policyAreas: {
          education: {
            id: 'education',
            title: 'Education Reform',
            description: 'Modern education system reform',
            objectives: ['Improve quality', 'Increase accessibility'],
            budget: [],
            implementation: {
              timeline: '2024-2026',
              milestones: ['Q1: Analysis', 'Q2: Implementation'],
              keyMetrics: ['Student performance', 'School enrollment']
            }
          }
        },
        financialValidation: {
          totalBudget: 800000,
          isBalanced: true,
          reviewComments: [],
        },
        metrics: {
          publicSupport: 92,
          feasibilityScore: 85,
          votes: 200
        }
      }
    ]

    it('displays a horizontal scrollable list of program cards', () => {
      cy.mount(<Home programs={mockPrograms} />)
      
      cy.get('[data-testid="programs-list"]')
        .should('exist')
      cy.get('[data-testid="programs-header"]')
        .should('exist')
        .should('contain', messages.home.programs.title)
      cy.get('[data-testid="programs-description"]')
        .should('exist')
        .should('contain', messages.home.programs.description)
      cy.get('[data-testid="programs-list"] .flex.gap-4.overflow-x-auto')
        .should('exist')
        .should('have.css', 'display', 'flex')
        .should('have.css', 'overflow-x', 'auto')
    })

    it('renders program cards with correct information', () => {
      cy.mount(<Home programs={mockPrograms} />)
      
      cy.get('[data-testid="program-card"]').should('have.length', 2)
      
      // Check first program card
      cy.get('[data-testid="program-card"]').first().within(() => {
        cy.get('[data-testid="program-title"]')
          .should('contain', 'Economic Reform')
        cy.get('[data-testid="program-description"]')
          .should('contain', 'Comprehensive economic reform plan')
        cy.get('[data-testid="program-metrics"]').within(() => {
          cy.get('[data-testid="public-support"]')
            .should('contain', `85% ${messages.home.programs.metrics.support}`)
          cy.get('[data-testid="feasibility-score"]')
            .should('contain', `90% ${messages.home.programs.metrics.feasible}`)
          cy.get('[data-testid="votes-count"]')
            .should('contain', `150 ${messages.home.programs.metrics.votes}`)
        })
      })
    })

    it('displays empty state when no programs are available', () => {
      cy.mount(<Home programs={[]} />)
      
      cy.get('[data-testid="programs-empty"]')
        .should('exist')
        .should('be.visible')
        .should('contain', messages.home.programs.empty)
      
      // Create program card should still be visible
      cy.get('[data-testid="create-program-card"]')
        .should('exist')
        .should('be.visible')
    })

    it('displays create program card at the end of the list', () => {
      cy.mount(<Home programs={mockPrograms} />)
      
      cy.get('[data-testid="create-program-card"]')
        .should('exist')
        .scrollIntoView()
        .should('be.visible')
        .should('contain', messages.home.programs.create.title)
    })
  })
})