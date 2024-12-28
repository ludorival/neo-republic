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

  it('shows program details form', () => {
    cy.get('[data-testid="program-slogan-input"]')
      .should('exist')
      .should('have.prop', 'required', true)
      .should('have.attr', 'placeholder', messages.programs.create.form.sloganPlaceholder)
    
    cy.get('[data-testid="program-description-input"]')
      .should('exist')
      .should('have.prop', 'required', true)
      .should('have.attr', 'placeholder', messages.programs.create.form.descriptionPlaceholder)
  })

  it('validates program details', () => {
    // Try to add objective without program details
    cy.get('[data-testid="policy-area-card"]').first().click()
    cy.get('[data-testid="add-objective-button"]').should('be.disabled')

    // Fill in program details
    cy.get('[data-testid="program-slogan-input"]').type('Test Program Slogan')
    cy.get('[data-testid="program-description-input"]').type('Test Program Description')

    // Now should be able to add objectives
    cy.get('[data-testid="add-objective-button"]').should('not.be.disabled')
  })

  it('shows policy areas section with all required areas', () => {
    cy.get('[data-testid="policy-areas-section"]')
      .should('exist')
      .should('contain', messages.programs.create.policyAreas.title)

    // Check if all 6 mandatory policy areas are displayed
    cy.get('[data-testid="policy-area-card"]')
      .should('have.length', 6)
  })

  it('allows adding and removing objectives', () => {
    // Fill in program details first
    cy.get('[data-testid="program-slogan-input"]').type('Test Program Slogan')
    cy.get('[data-testid="program-description-input"]').type('Test Program Description')

    // Click first policy area
    cy.get('[data-testid="policy-area-card"]').first().click()

    // Open modal and add an objective
    cy.get('[data-testid="add-objective-button"]').click()
    cy.get('[data-testid="objective-description-input"]').type('Test objective')
    cy.get('[data-testid="objective-revenue-input"]').type('1000')
    cy.get('[data-testid="objective-expenses-input"]').type('500')
    cy.get('[data-testid="save-objective-button"]').click()

    // Modal should close
    cy.get('[data-testid="objective-modal"]').should('not.exist')

    // Should show one objective
    cy.get('[data-testid="policy-objective-card"]')
      .should('have.length', 1)
      .should('contain', 'Test objective')
      .should('contain', '+$1000')
      .should('contain', '-$500')

    // Area should be marked as complete
    cy.get('[data-testid="policy-area-status-complete"]').should('have.length', 1)

    // Remove the objective
    cy.get('[data-testid="remove-objective-button"]').click()
    cy.get('[data-testid="policy-objective-card"]').should('not.exist')

    // Area should be marked as incomplete
    cy.get('[data-testid="policy-area-status-incomplete"]').should('have.length', 6)
  })

  it('allows editing existing objectives', () => {
    // Fill in program details first
    cy.get('[data-testid="program-slogan-input"]').type('Test Program Slogan')
    cy.get('[data-testid="program-description-input"]').type('Test Program Description')

    // Click first policy area and add an objective
    cy.get('[data-testid="policy-area-card"]').first().click()
    cy.get('[data-testid="add-objective-button"]').click()
    cy.get('[data-testid="objective-description-input"]').type('Test objective')
    cy.get('[data-testid="objective-revenue-input"]').type('1000')
    cy.get('[data-testid="objective-expenses-input"]').type('500')
    cy.get('[data-testid="save-objective-button"]').click()

    // Click edit button on the objective
    cy.get('[data-testid="edit-objective-button"]').click()

    // Modal should open with existing values
    cy.get('[data-testid="objective-modal"]').should('be.visible')
    cy.get('[data-testid="objective-description-input"]').should('have.value', 'Test objective')
    cy.get('[data-testid="objective-revenue-input"]').should('have.value', '1000')
    cy.get('[data-testid="objective-expenses-input"]').should('have.value', '500')

    // Edit the values
    cy.get('[data-testid="objective-description-input"]').clear().type('Updated objective')
    cy.get('[data-testid="objective-revenue-input"]').clear().type('2000')
    cy.get('[data-testid="objective-expenses-input"]').clear().type('1000')
    cy.get('[data-testid="save-objective-button"]').click()

    // Modal should close and objective should be updated
    cy.get('[data-testid="objective-modal"]').should('not.exist')
    cy.get('[data-testid="policy-objective-card"]')
      .should('have.length', 1)
      .should('contain', 'Updated objective')
      .should('contain', '+$2000')
      .should('contain', '-$1000')
  })

  it('validates objective modal inputs', () => {
    // Fill in program details first
    cy.get('[data-testid="program-slogan-input"]').type('Test Program Slogan')
    cy.get('[data-testid="program-description-input"]').type('Test Program Description')

    // Click first policy area and open modal
    cy.get('[data-testid="policy-area-card"]').first().click()
    cy.get('[data-testid="add-objective-button"]').click()

    // Try to save without required fields
    cy.get('[data-testid="save-objective-button"]').click()
    cy.get('[data-testid="objective-modal"]').should('be.visible') // Modal should stay open
    cy.get('[data-testid="policy-objective-card"]').should('not.exist')

    // Cancel should close modal
    cy.get('[data-testid="cancel-objective-button"]').click()
    cy.get('[data-testid="objective-modal"]').should('not.exist')
  })

  it('shows appropriate action buttons based on completion', () => {
    // Fill in program details first
    cy.get('[data-testid="program-slogan-input"]').type('Test Program Slogan')
    cy.get('[data-testid="program-description-input"]').type('Test Program Description')

    // Initially should only see draft button
    cy.get('[data-testid="save-draft-button"]').should('exist')
    cy.get('[data-testid="publish-program-button"]').should('not.exist')

    // Add objectives to all areas
    cy.get('[data-testid="policy-area-card"]').each($card => {
      cy.wrap($card).click()
      cy.get('[data-testid="add-objective-button"]').click()
      cy.get('[data-testid="objective-description-input"]').type('Test objective')
      cy.get('[data-testid="objective-revenue-input"]').type('1000')
      cy.get('[data-testid="objective-expenses-input"]').type('500')
      cy.get('[data-testid="save-objective-button"]').click()
    })

    // Should now see publish button
    cy.get('[data-testid="publish-program-button"]').should('exist')
  })

  it('maintains selected area visual state', () => {
    // Click first policy area
    cy.get('[data-testid="policy-area-card"]').first()
      .click()
      .should('have.class', 'ring-2')
      .should('have.class', 'ring-primary')

    // Click another area
    cy.get('[data-testid="policy-area-card"]').eq(1)
      .click()
      .should('have.class', 'ring-2')
      .should('have.class', 'ring-primary')

    // First area should no longer be selected
    cy.get('[data-testid="policy-area-card"]').first()
      .should('not.have.class', 'ring-2')
      .should('not.have.class', 'ring-primary')
  })
}) 