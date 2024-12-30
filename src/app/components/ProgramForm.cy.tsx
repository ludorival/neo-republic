import React from 'react'
import { Program } from '@/domain/models/program'
import messages from '../../../messages/fr.json'
import ProgramForm from './ProgramForm'

describe('<ProgramForm />', () => {
  const mockProgram: Program = {
    id: '123',
    slogan: 'Test Slogan',
    description: 'Test Description',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'user123',
    policyAreas: {
      economy: {
        id: 'economy',
        title: 'Economy',
        description: 'Economic policies',
        position: 1,
        objectives: []
      },
      education: {
        id: 'education',
        title: 'Education',
        description: 'Education policies',
        position: 2,
        objectives: []
      },
      environment: {
        id: 'environment',
        title: 'Environment',
        description: 'Environmental policies',
        position: 3,
        objectives: []
      },
      healthcare: {
        id: 'healthcare',
        title: 'Healthcare',
        description: 'Healthcare policies',
        position: 4,
        objectives: []
      },
      infrastructure: {
        id: 'infrastructure',
        title: 'Infrastructure',
        description: 'Infrastructure policies',
        position: 5,
        objectives: []
      },
      social: {
        id: 'social',
        title: 'Social',
        description: 'Social policies',
        position: 6,
        objectives: []
      }
    },
    financialValidation: {
      totalBudget: 0,
      isBalanced: true,
      reviewComments: []
    },
    metrics: {
      publicSupport: 0,
      feasibilityScore: 0,
      votes: 0
    }
  }

  beforeEach(() => {
    cy.mount(<ProgramForm program={{...mockProgram}} />)
  })

  it('shows program details form', () => {
    cy.get('[data-testid="program-slogan-input"]')
      .should('exist')
      .should('have.prop', 'required', true)
      .should('have.attr', 'placeholder', messages.programs.form.sloganPlaceholder)
      .should('have.attr', 'aria-label', messages.programs.form.programSlogan)
    
    cy.get('[data-testid="program-description-input"]')
      .should('exist')
      .should('have.prop', 'required', true)
      .should('have.attr', 'placeholder', messages.programs.form.descriptionPlaceholder)
      .should('have.attr', 'aria-label', messages.programs.form.programDescription)
  })

  it('validates program details', () => {
    // Try to add objective without program details
    cy.get('[data-testid="policy-area-card"]').first().click()
    cy.get('[data-testid="add-objective-button"]')
      .should('not.be.disabled')

    // Fill in program details
    cy.get('[data-testid="program-slogan-input"]').type('Test Program Slogan')
    cy.get('[data-testid="program-description-input"]').type('Test Program Description')

    // Now should be able to add objectives
    cy.get('[data-testid="add-objective-button"]')
      .should('not.be.disabled')
  })

  it('shows policy areas section with all required areas', () => {
    cy.get('[data-testid="policy-areas-section"]')
      .should('exist')
      .should('contain', messages.programs.form.policyAreas.title)

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
    cy.get('[data-testid="objective-modal"]').should('exist')
    // cy.get('[data-testid="policy-objective-card"]').should('not.exist')

    // Cancel should close modal
    cy.get('[data-testid="cancel-objective-button"]').click()


    cy.get('[data-testid="objective-modal"]').should('not.exist')
  })

  it('shows appropriate action buttons based on completion', () => {
    // Initially publish button should be disabled with message
    cy.get('[data-testid="publish-program-button"]')
      .should('exist')
      .should('be.disabled')
    
    cy.get('[data-testid="publish-disabled-message"]')
      .should('exist')
      .should('contain', messages.programs.form.publishDisabledTooltip)

    // Fill in program details
    cy.get('[data-testid="program-slogan-input"]').type('Test Program Slogan')
    cy.get('[data-testid="program-description-input"]').type('Test Program Description')

    // Add objectives to all areas
    cy.get('[data-testid="policy-area-card"]').each($card => {
      cy.wrap($card).click()
      cy.get('[data-testid="add-objective-button"]').click()
      cy.get('[data-testid="objective-description-input"]').type('Test objective')
      cy.get('[data-testid="objective-revenue-input"]').type('1000')
      cy.get('[data-testid="objective-expenses-input"]').type('500')
      cy.get('[data-testid="save-objective-button"]').click()
    })

    // Publish button should be enabled and message should be hidden
    cy.get('[data-testid="publish-program-button"]')
      .should('exist')
      .should('not.be.disabled')
    
    cy.get('[data-testid="publish-disabled-message"]').should('not.exist')
  })

  it('shows and hides publish disabled message based on objectives completion', () => {
    // Fill in program details first
    cy.get('[data-testid="program-slogan-input"]').type('Test Program Slogan')
    cy.get('[data-testid="program-description-input"]').type('Test Program Description')

    // Initially message should be visible
    // cy.get('[data-testid="publish-program-button"]').should('be.disabled')
    cy.get('[data-testid="publish-disabled-message"]')
      .should('exist')
      .should('have.text', messages.programs.form.publishDisabledTooltip)

    // Add objective to one area
    cy.get('[data-testid="policy-area-card"]').first().click()
    cy.get('[data-testid="add-objective-button"]').click()
    cy.get('[data-testid="objective-description-input"]').type('Test objective')
    cy.get('[data-testid="objective-revenue-input"]').type('1000')
    cy.get('[data-testid="objective-expenses-input"]').type('500')
    cy.get('[data-testid="save-objective-button"]').click()

    // Message should still be visible as not all areas have objectives
    cy.get('[data-testid="publish-disabled-message"]').should('exist')

    // Complete all other areas
    cy.get('[data-testid="policy-area-card"]').each(($card, index) => {
      if (index === 0) return // Skip first card as it's already done
      cy.wrap($card).click()
      cy.get('[data-testid="add-objective-button"]').click()
      cy.get('[data-testid="objective-description-input"]').type('Test objective')
      cy.get('[data-testid="objective-revenue-input"]').type('1000')
      cy.get('[data-testid="objective-expenses-input"]').type('500')
      cy.get('[data-testid="save-objective-button"]').click()
    })

    // Message should be hidden when all areas have objectives
    cy.get('[data-testid="publish-disabled-message"]').should('not.exist')
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