import { createProgram, Program } from '@/domain/models/program'
import ViewProgram from './ViewProgram'

const mockProgram: Program = {
  ...createProgram({
    authorId: 'author123',
    policyAreas: ['economy', 'social', 'education', 'infrastructure', 'environment', 'security'],
    slogan: 'Building a Better Tomorrow',
    description: 'A comprehensive program focused on sustainable development and social equity'
  }),
  id: '123',
  status: 'published',
  policyAreas: {
    economy: {
      objectives: [
        {
          label: 'Economic Objective 1',
          details: 'Details for economic objective 1',
          budget: { revenue: 1000, expenses: 800 }
        }
      ]
    },
    social: {
      objectives: [
        {
          label: 'Social Objective 1',
          details: 'Details for social objective 1',
          budget: { revenue: 500, expenses: 400 }
        }
      ]
    },
    education: { objectives: [] },
    infrastructure: { objectives: [] },
    environment: { objectives: [] },
    security: { objectives: [] }
  },
  metrics: {
    publicSupport: 75,
    feasibilityScore: 80,
    votes: 150
  }
}

const mockDraftProgram: Program = {
  ...mockProgram,
  status: 'draft'
}

describe('<ViewProgram />', () => {
  it('displays published program details correctly', () => {
    cy.mount(<ViewProgram program={mockProgram} />)

    // Check header content
    cy.contains('Building a Better Tomorrow').should('be.visible')
    cy.contains('A comprehensive program focused on sustainable development and social equity').should('be.visible')
    cy.contains('Retour aux Programmes').should('be.visible')
    cy.contains('Modifier le Programme').should('not.exist')

    // Check policy areas
    cy.get('[data-testid="policy-area-card"]').should('have.length', 6)
    cy.contains('Economic Objective 1').should('be.visible')
    cy.contains('Social Objective 1').should('be.visible')

    // Check budget section
    cy.get('[data-testid="program-budget"]').should('be.visible')
    cy.get('[data-testid="total-revenue-value"]').should('be.visible')
    cy.get('[data-testid="total-expenses-value"]').should('be.visible')
    cy.get('[data-testid="total-balance-value"]').should('be.visible')
    cy.get('[data-testid="total-balance"]').should('be.visible')

    // Check metrics
    cy.contains('Métriques du Programme').should('be.visible')
    cy.contains('75%').should('be.visible') // publicSupport
    cy.contains('80%').should('be.visible') // feasibilityScore
    //cy.contains('150').should('be.visible') // votes
    cy.contains('Voter pour ce Programme').should('be.visible')
  })

  it('displays draft program with edit button', () => {
    cy.mount(<ViewProgram program={mockDraftProgram} />)

    cy.contains('Modifier le Programme').should('be.visible')
    cy.contains('Métriques du Programme').should('not.exist')
    cy.contains('Voter pour ce Programme').should('not.exist')

    // Budget section should still be visible in draft mode
    cy.get('[data-testid="program-budget"]').should('be.visible')
  })

  it('displays negative balance in red', () => {
    const programWithNegativeBalance = {
      ...mockProgram,
      policyAreas: {
        ...mockProgram.policyAreas,
        economy: {
          objectives: [
            {
              label: 'Economic Objective 1',
              details: 'Details for economic objective 1',
              budget: { revenue: 500, expenses: 800 }
            }
          ]
        }
      }
    }

    cy.mount(<ViewProgram program={programWithNegativeBalance} />)

    cy.get('[data-testid="total-balance"]').should('have.class', 'text-danger')
  })
}) 