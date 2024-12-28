import React from 'react'
import CreateProgramPage from './page'
import messages from '../../../../messages/fr.json'

describe('<CreateProgramPage />', () => {
  beforeEach(() => {
    cy.mount(<CreateProgramPage />)
  })

  it('displays the page title and description', () => {
    cy.get('[data-testid="create-program-title"]')
      .should('exist')
      .should('contain', messages.programs.create.title)
    
    cy.get('[data-testid="create-program-description"]')
      .should('exist')
      .should('contain', messages.programs.create.description)
  })

  it('shows policy areas section', () => {
    cy.get('[data-testid="policy-areas-section"]')
      .should('exist')
      .should('contain', messages.programs.create.policyAreas.title)

    // Check if all policy area options are displayed
    cy.get('[data-testid="policy-area-card"]')
      .should('have.length.at.least', 1)
      .first()
      .should('contain', messages.programs.create.policyAreas.economy.title)
      .should('contain', messages.programs.create.policyAreas.economy.description)
  })

  it('allows selecting a policy area', () => {
    cy.get('[data-testid="policy-area-card"]')
      .first()
      .click()
      .should('have.class', 'selected')

    cy.get('[data-testid="continue-button"]')
      .should('be.enabled')
      .click()

    // Should show the policy area form
    cy.get('[data-testid="policy-area-form"]')
      .should('exist')
  })

  it('requires at least one policy area to continue', () => {
    cy.get('[data-testid="continue-button"]')
      .should('be.disabled')
  })

  it('shows validation error when trying to submit empty form', () => {
    cy.get('[data-testid="policy-area-card"]')
      .first()
      .click()

    cy.get('[data-testid="continue-button"]')
      .click()

    cy.get('[data-testid="submit-program"]')
      .click()

    cy.get('[data-testid="form-error"]')
      .should('exist')
      .should('contain', messages.programs.create.errors.required)
  })
}) 