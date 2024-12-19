import React from 'react'
import Home from './page'

describe('<Home />', () => {
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
})