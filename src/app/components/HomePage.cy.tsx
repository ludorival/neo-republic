import React from 'react'
import { auth } from '@/infra/firebase/auth'
import { Program } from '@/domain/models/program'
import messages from '../../../messages/fr.json'
import HomePage from './HomePage'

describe('<Home />', () => {
  let stubSignInWithGoogle: sinon.SinonStub
  beforeEach(() => {
    // Create a stub for signInWithGoogle
    stubSignInWithGoogle = cy.stub(auth, 'signInWithGoogle')
      .as('signInWithGoogle')
      .returns(Promise.resolve())
  })

  it('renders top bar with navigation and login button', () => {
    cy.mount(<HomePage programs={[]} />)
    
    cy.get('[data-testid="top-bar"]').should('exist')
    cy.get('a').contains('About').should('exist').should('have.attr', 'href', '/about')
    cy.get('[data-testid="login-button"]')
      .should('exist')
      .should('have.text', 'Connexion')
      .should('be.visible')
  })

  it('opens login modal when clicking login button', () => {
    cy.mount(<HomePage programs={[]} />)
    
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
    cy.mount(<HomePage programs={[]} />)
    
    // Open modal and click Google sign-in button
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="google-signin-button"]').click()
    
    // Verify the auth method was called
    cy.get('@signInWithGoogle').should('have.been.calledOnce')
  })

  it('shows error message when Google sign in fails', () => {
    // Update stub to reject with error
    stubSignInWithGoogle.rejects(new Error('Authentication failed'))
      
    cy.mount(<HomePage programs={[]} />)
    
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

    cy.mount(<HomePage programs={[]} />)
    
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

    cy.mount(<HomePage programs={[]} />)
    
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
        slogan: 'Economic Reform',
        description: 'Comprehensive economic reform plan',
        status: 'published' as const,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        authorId: 'hidden',
        policyAreas: {
          economy: {
            id: 'economy',
            title: 'Economic Reform',
            description: 'Comprehensive economic reform plan',
            objectives: [
              {
                description: 'Reduce the rate of inflation',
                budget: {
                  revenue: 100000,
                  expenses: 50000
                }
              }, {
                description: 'Create jobs',
                budget: {
                  revenue: 100000,
                  expenses: 50000
                }
              }
            ],
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
        slogan: 'Education Reform',
        description: 'Modern education system reform',
        status: 'published' as const,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        authorId: 'hidden',
        policyAreas: {
          education: {
            id: 'education',
            title: 'Education Reform',
            description: 'Modern education system reform',
            objectives: [
              {
                description: 'Improve quality',
                budget: {
                  revenue: 100000,
                  expenses: 50000
                }
              }, {
                description: 'Increase accessibility',
                budget: {
                  revenue: 100000,
                  expenses: 50000
                }
              }
            ],
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
      cy.mount(<HomePage programs={mockPrograms} />)
      
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
      cy.mount(<HomePage programs={mockPrograms} />)
      
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
      cy.mount(<HomePage programs={[]} />)
      
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
      cy.mount(<HomePage programs={mockPrograms} />)
      
      cy.get('[data-testid="create-program-card"]')
        .should('exist')
        .scrollIntoView()
        .should('be.visible')
        .should('contain', messages.home.programs.create.title)
    })
  })

  describe('Program Creation Authentication', () => {
    it('shows login modal when unauthenticated user clicks create program', () => {
        cy.mount(<HomePage />)
      
      cy.get('[data-testid="create-program-card"]').click()
      cy.get('[data-testid="login-modal"]')
        .should('exist')
        .should('be.visible')
      cy.get('[data-testid="login-modal-title"]')
        .should('contain', messages.auth.loginRequired)
      cy.get('[data-testid="login-modal-message"]')
        .should('contain', messages.auth.loginToCreate)
    })

    it('redirects to program creation when authenticated user clicks create program', () => {
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

      cy.mount(<HomePage />)
      
      cy.get('[data-testid="create-program-card"]').click()
      cy.get('@routerPush')
        .should('have.been.calledOnce')
        .and('have.been.calledWith', '/programs/create')
    })

    it('redirects to program creation after successful authentication', () => {
        stubSignInWithGoogle.resolves({
            uid: '123',
            email: 'john@example.com',
            displayName: 'John Doe',
            photoURL: 'https://example.com/profile.jpg'
        })
        cy.mount(<HomePage />)
      
      // Click create program, then authenticate
      cy.get('[data-testid="create-program-card"]').click()
      cy.get('[data-testid="google-signin-button"]').click()
      
      // Verify navigation after successful auth
      cy.get('@routerPush')
        .should('have.been.calledOnce')
        .and('have.been.calledWith', '/programs/create')
    })

    it('shows error message when authentication fails during program creation', () => {
      // Update stub to reject with error
      stubSignInWithGoogle.rejects(new Error('Authentication failed'))
      
      cy.mount(<HomePage />)
      
      // Click create program, then try to authenticate
      cy.get('[data-testid="create-program-card"]').click()
      cy.get('[data-testid="google-signin-button"]').click()
      
      // Verify error message is shown
      cy.get('[data-testid="error-message"]')
        .should('exist')
        .should('be.visible')
        .should('have.text', messages.auth.error)
      
      // Verify we stay on the same page
      cy.get('[data-testid="login-modal"]').should('be.visible')
    })
  })
}) 