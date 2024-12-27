import React from 'react'
import Home from './page'
import { auth } from '@/lib/firebase/auth'

describe('<Home />', () => {
  let stubSignInWithGoogle: sinon.SinonStub
  beforeEach(() => {
    // Create a stub for signInWithGoogle
    stubSignInWithGoogle = cy.stub(auth, 'signInWithGoogle')
      .as('signInWithGoogle')
      .returns(Promise.resolve())
  })

  it('renders top bar with login button', () => {
    cy.mount(<Home />)
    
    cy.get('[data-testid="top-bar"]').should('exist')
    cy.get('[data-testid="login-button"]')
      .should('exist')
      .should('have.text', 'Connexion')
      .should('be.visible')
  })

  it('displays project description content', () => {
    cy.mount(<Home />)
    
    cy.get('[data-testid="project-description"]')
      .should('exist')
      .should('include.text', 'Neo-Republic')
      .should('include.text', 'Les citoyens votent pour des programmes politiques détaillés')
  })

  it('opens login modal when clicking login button', () => {
    cy.mount(<Home />)
    
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
    cy.mount(<Home />)
    
    // Open modal and click Google sign-in button
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="google-signin-button"]').click()
    
    // Verify the auth method was called
    cy.get('@signInWithGoogle').should('have.been.calledOnce')
  })

  it('shows error message when Google sign in fails', () => {
    // Update stub to reject with error
    stubSignInWithGoogle.rejects(new Error('Authentication failed'))
      
    cy.mount(<Home />)
    
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
    // Mock authenticated user
    const mockUser = {
      displayName: 'John Doe',
      email: 'john@example.com',
      uid: '123'
    }
    cy.stub(auth, 'onAuthStateChanged').callsFake(callback => {
      callback(mockUser)
      return () => {}
    })

    cy.mount(<Home />)
    
    // Verify login button is replaced with user name
    cy.get('[data-testid="login-button"]').should('not.exist')
    cy.get('[data-testid="user-name"]')
      .should('exist')
      .should('be.visible')
      .should('have.text', 'John Doe')
  })
})