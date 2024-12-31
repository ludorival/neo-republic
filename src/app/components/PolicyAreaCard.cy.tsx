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

  it('displays objectives and budget totals when objectives exist', () => {
    const areaWithObjectives: PolicyArea = {
      objectives: [{
        label: 'Test objective',
        details: 'Implementation details',
        budget: { revenue: 1000, expenses: 500 }
      }]
    }

    cy.mount(<PolicyAreaCard {...getDefaultProps()} area={areaWithObjectives} />)
    
    // Check objective is listed
    cy.contains('Test objective').should('be.visible')
    
    // Check budget totals
    cy.contains('+1000k€').should('be.visible')
    cy.contains('-500k€').should('be.visible')
    cy.contains('✓ 500k€').should('be.visible')
    
    // Check complete status
    cy.get('[data-testid="policy-area-status-complete"]').should('exist')
  })

  it('shows negative balance indicator when expenses exceed revenue', () => {
    const areaWithNegativeBudget: PolicyArea = {
      objectives: [{
        label: 'Test objective',
        details: 'Implementation details',
        budget: { revenue: 500, expenses: 1000 }
      }]
    }

    cy.mount(<PolicyAreaCard {...getDefaultProps()} area={areaWithNegativeBudget} />)
    
    cy.contains('+500k€').should('be.visible')
    cy.contains('-1000k€').should('be.visible')
    cy.contains('! -500k€').should('be.visible')
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

  it('shows multiple objectives with total budget', () => {
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
    
    // Check both objectives are listed
    cy.contains('First objective').should('be.visible')
    cy.contains('Second objective').should('be.visible')
    
    // Check total budget (1000 + 2000 = 3000 revenue, 500 + 1000 = 1500 expenses)
    cy.contains('+3000k€').should('be.visible')
    cy.contains('-1500k€').should('be.visible')
    cy.contains('✓ 1500k€').should('be.visible')
  })
}) 