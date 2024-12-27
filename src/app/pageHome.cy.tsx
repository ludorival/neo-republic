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

    cy.mount(<Home />)
    
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
    const stubSignOut = cy.stub(auth, 'signOut').as('signOut').resolves()

    cy.mount(<Home />)
    
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
})