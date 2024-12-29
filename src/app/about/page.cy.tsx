import React from 'react'
import About from './page'

describe('<About />', () => {
  it('displays project description content', () => {
    cy.mount(<About />)
    
    cy.get('[data-testid="top-bar"]').should('exist')
    cy.get('[data-testid="project-description"]')
      .should('exist')
      .should('include.text', 'Neo-Republic')
      .should('include.text', 'Les citoyens votent pour des programmes politiques détaillés')
  })

  it('displays key features', () => {
    cy.mount(<About />)
    
    cy.get('[data-testid="project-description"]').within(() => {
      cy.get('h2').should('contain', 'Caractéristiques Principales')
      cy.get('.feature-card').should('have.length', 4)
      cy.get('.feature-card').first().should('contain', 'Soumissions anonymes des programmes')
    })
  })

  it('has working navigation', () => {
    cy.mount(<About />)
    
    cy.get('[data-testid="top-bar"]').within(() => {
      cy.get('a[href="/"]').should('exist')
      cy.get('a[href="/about"]').should('exist')
    })
  })
}) 