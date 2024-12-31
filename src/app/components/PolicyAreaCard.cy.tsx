import React from 'react'
import { PolicyArea } from '@/domain/models/program'
import PolicyAreaCard from './PolicyAreaCard'

describe('<PolicyAreaCard />', () => {
  const mockArea: PolicyArea = {
    objectives: []
  }

  const getDefaultProps = () => ({
    id: 'economy',
    area: mockArea,
    isSelected: false,
    onSelect: cy.stub().as('onSelect')
  })

  it('displays empty state when no objectives', () => {
    cy.mount(<PolicyAreaCard {...getDefaultProps()} />)
    cy.contains('No objectives yet').should('be.visible')
    cy.get('[data-testid="policy-area-status-incomplete"]').should('exist')
  })

  it('displays objective with its budget details', () => {
    const areaWithObjectives: PolicyArea = {
      objectives: [{
        label: 'Test objective',
        details: 'Implementation details',
        budget: { revenue: 1000, expenses: 500 }
      }]
    }

    cy.mount(<PolicyAreaCard {...getDefaultProps()} area={areaWithObjectives} />)
    
    // Check objective label and budget details
    cy.contains('Test objective').should('be.visible')
    cy.contains('span', '+1000k€').should('have.class', 'text-success-400')
    cy.contains('span', '-500k€').should('have.class', 'text-danger-400')
    cy.contains('span', '✓ 500k€').should('have.class', 'text-success-400')
    
    // Check area total budget
    cy.get('.border-t').within(() => {
      cy.contains('p', '+1000k€').should('have.class', 'text-success-400')
      cy.contains('p', '-500k€').should('have.class', 'text-danger-400')
      cy.contains('p', '✓ 500k€').should('have.class', 'text-success-400')
    })
    
    // Check complete status
    cy.get('[data-testid="policy-area-status-complete"]').should('exist')
  })

  it('shows and hides objective details when clicking More/Less', () => {
    const areaWithObjectives: PolicyArea = {
      objectives: [{
        label: 'Test objective',
        details: 'Implementation details',
        budget: { revenue: 1000, expenses: 500 }
      }]
    }

    cy.mount(<PolicyAreaCard {...getDefaultProps()} area={areaWithObjectives} />)
    
    // Initially details should be hidden
    cy.get('[data-testid="objective-details-0"]').should('not.exist')
    
    // Click More button
    cy.get('[data-testid="objective-details-button-0"]').click()
    cy.get('[data-testid="objective-details-0"]')
      .should('be.visible')
      .and('contain', 'Implementation details')
    
    // Click Less button
    cy.get('[data-testid="objective-details-button-0"]').click()
    cy.get('[data-testid="objective-details-0"]').should('not.exist')
  })

  it('shows negative balance indicators for objective and total when expenses exceed revenue', () => {
    const areaWithNegativeBudget: PolicyArea = {
      objectives: [{
        label: 'Test objective',
        details: 'Implementation details',
        budget: { revenue: 500, expenses: 1000 }
      }]
    }

    cy.mount(<PolicyAreaCard {...getDefaultProps()} area={areaWithNegativeBudget} />)
    
    // Check objective budget details with negative balance
    cy.contains('span', '+500k€').should('have.class', 'text-success-400')
    cy.contains('span', '-1000k€').should('have.class', 'text-danger-400')
    cy.contains('span', '! -500k€').should('have.class', 'text-danger-400')
    
    // Check area total budget with negative balance
    cy.get('.border-t').within(() => {
      cy.contains('p', '+500k€').should('have.class', 'text-success-400')
      cy.contains('p', '-1000k€').should('have.class', 'text-danger-400')
      cy.contains('p', '! -500k€').should('have.class', 'text-danger-400')
    })
  })

  it('shows selected state when isSelected is true', () => {
    cy.mount(<PolicyAreaCard {...getDefaultProps()} isSelected={true} />)
    cy.get('[data-testid="policy-area-card"]').should('have.class', 'ring-2')
  })

  it('calls onSelect when clicked', () => {
    cy.mount(<PolicyAreaCard {...getDefaultProps()} />)
    cy.get('[data-testid="policy-area-card"]').click()
    cy.get('@onSelect').should('have.been.calledWith', 'economy')
  })

  it('shows multiple objectives with individual and total budgets', () => {
    const areaWithMultipleObjectives: PolicyArea = {
      objectives: [
        {
          label: 'First objective',
          details: 'First details',
          budget: { revenue: 1000, expenses: 500 }
        },
        {
          label: 'Second objective',
          details: 'Second details',
          budget: { revenue: 2000, expenses: 1000 }
        }
      ]
    }

    cy.mount(<PolicyAreaCard {...getDefaultProps()} area={areaWithMultipleObjectives} />)
    
    // Check first objective budget details
    cy.contains('First objective').parent().parent().within(() => {
      cy.contains('span', '+1000k€').should('have.class', 'text-success-400')
      cy.contains('span', '-500k€').should('have.class', 'text-danger-400')
      cy.contains('span', '✓ 500k€').should('have.class', 'text-success-400')
    })

    // Check second objective budget details
    cy.contains('Second objective').parent().parent().within(() => {
      cy.contains('span', '+2000k€').should('have.class', 'text-success-400')
      cy.contains('span', '-1000k€').should('have.class', 'text-danger-400')
      cy.contains('span', '✓ 1000k€').should('have.class', 'text-success-400')
    })
    
    // Check total budget (1000 + 2000 = 3000 revenue, 500 + 1000 = 1500 expenses)
    cy.get('.border-t').within(() => {
      cy.contains('p', '+3000k€').should('have.class', 'text-success-400')
      cy.contains('p', '-1500k€').should('have.class', 'text-danger-400')
      cy.contains('p', '✓ 1500k€').should('have.class', 'text-success-400')
    })

    // Test expanding details for both objectives
    cy.get('[data-testid="objective-details-button-0"]').click()
    cy.get('[data-testid="objective-details-0"]')
      .should('be.visible')
      .and('contain', 'First details')

    cy.get('[data-testid="objective-details-button-1"]').click()
    cy.get('[data-testid="objective-details-1"]')
      .should('be.visible')
      .and('contain', 'Second details')
  })
}) 