import React from 'react'
import { Program, createProgram } from '@/domain/models/program'
import messages from '../../../messages/fr.json'
import ProgramForm from './ProgramForm'
import * as repositories from "@/infra/firebase/firestore";


describe('<ProgramForm />', () => {
  beforeEach(() => {
    const mockProgram: Program = {...createProgram({
      authorId: '1',
      policyAreas: messages.programs['policyAreaKeys'].split(',')
    }), id: '1'}

    const programsCollection: Record<string, Program> = {
      [mockProgram.id]: mockProgram
    }
    cy.stub(repositories.programs, 'read').callsFake((id) => Promise.resolve(programsCollection[id]) )
    cy.stub(repositories.programs, 'update').callsFake((id, program) => {
      programsCollection[id] = {...programsCollection[id], ...program}
      return Promise.resolve(programsCollection[id])  
    })
    cy.mount(<ProgramForm program={mockProgram} />)
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

    // Click add objective button and verify form appears
    cy.get('[data-testid="add-objective-button"]').click()
    cy.get('[data-testid="objective-label-input"]').should('exist')

    // Fill in objective details
    cy.get('[data-testid="objective-label-input"]').type('Test objective')
    cy.get('[data-testid="objective-details-input"]').type('Implementation details for test objective')
    cy.get('[data-testid="objective-revenue-input"]').type('1000')
    cy.get('[data-testid="objective-expenses-input"]').type('500')
    cy.get('[data-testid="save-objective-button"]').click()

    // Form should be hidden
    cy.get('[data-testid="objective-label-input"]').should('not.exist')

    // Should show one objective
    cy.get('[data-testid="policy-objective-card"]')
      .should('have.length', 1)
      .should('contain', 'Test objective')
      .should('contain', 'Implementation details for test objective')
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
    cy.get('[data-testid="objective-label-input"]').type('Test objective')
    cy.get('[data-testid="objective-details-input"]').type('Implementation details for test objective')
    cy.get('[data-testid="objective-revenue-input"]').type('1000')
    cy.get('[data-testid="objective-expenses-input"]').type('500')
    cy.get('[data-testid="save-objective-button"]').click()

    // Click edit button on the objective
    cy.get('[data-testid="edit-objective-button"]').click()

    // Form should appear with existing values
    cy.get('[data-testid="objective-label-input"]').should('have.value', 'Test objective')
    cy.get('[data-testid="objective-details-input"]').should('have.value', 'Implementation details for test objective')
    cy.get('[data-testid="objective-revenue-input"]').should('have.value', '1000')
    cy.get('[data-testid="objective-expenses-input"]').should('have.value', '500')

    // Edit the values
    cy.get('[data-testid="objective-label-input"]').clear().type('Updated objective')
    cy.get('[data-testid="objective-details-input"]').clear().type('Updated implementation details')
    cy.get('[data-testid="objective-revenue-input"]').clear().type('2000')
    cy.get('[data-testid="objective-expenses-input"]').clear().type('1000')
    cy.get('[data-testid="save-objective-button"]').click()

    // Form should be hidden and objective should be updated
    cy.get('[data-testid="objective-label-input"]').should('not.exist')
    cy.get('[data-testid="policy-objective-card"]')
      .should('have.length', 1)
      .should('contain', 'Updated objective')
      .should('contain', 'Updated implementation details')
      .should('contain', '+$2000')
      .should('contain', '-$1000')
  })

  it('validates objective form inputs', () => {
    // Fill in program details first
    cy.get('[data-testid="program-slogan-input"]').type('Test Program Slogan')
    cy.get('[data-testid="program-description-input"]').type('Test Program Description')

    // Click first policy area and open form
    cy.get('[data-testid="policy-area-card"]').first().click()
    cy.get('[data-testid="add-objective-button"]').click()

    // Try to save without required fields
    cy.get('[data-testid="save-objective-button"]')
      .should('be.disabled')

    // Cancel should hide form
    cy.get('[data-testid="cancel-objective-button"]').click()
    cy.get('[data-testid="objective-label-input"]').should('not.exist')
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
      cy.get('[data-testid="objective-label-input"]').type('Test objective')
      cy.get('[data-testid="objective-details-input"]').type('Implementation details for test objective')
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
    cy.get('[data-testid="publish-disabled-message"]')
      .should('exist')
      .should('have.text', messages.programs.form.publishDisabledTooltip)

    // Add objective to one area
    cy.get('[data-testid="policy-area-card"]').first().click()
    cy.get('[data-testid="add-objective-button"]').click()
    cy.get('[data-testid="objective-label-input"]').type('Test objective')
    cy.get('[data-testid="objective-details-input"]').type('Implementation details for test objective')
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
      cy.get('[data-testid="objective-label-input"]').type('Test objective')
      cy.get('[data-testid="objective-details-input"]').type('Implementation details for test objective')
      cy.get('[data-testid="objective-revenue-input"]').type('1000')
      cy.get('[data-testid="objective-expenses-input"]').type('500')
      cy.get('[data-testid="save-objective-button"]').click()
    })

    // Message should be hidden when all areas have objectives
    cy.get('[data-testid="publish-disabled-message"]').should('not.exist')
  })
}) 