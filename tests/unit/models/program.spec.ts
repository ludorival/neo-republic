import { expect } from 'chai';
import { Program, PolicyArea, computePolicyAreaBudget, computeProgramBudget } from '../../../src/domain/models/program';

describe('Program Model', () => {
  describe('computePolicyAreaBudget', () => {
    it('should compute total revenue and expenses for a policy area', () => {
      const policyArea: PolicyArea = {
        objectives: [
          { label: 'Obj 1', details: 'Details 1', budget: { revenue: 1000, expenses: 800 } },
          { label: 'Obj 2', details: 'Details 2', budget: { revenue: 500, expenses: 300 } }
        ]
      };

      const result = computePolicyAreaBudget(policyArea);
      expect(result.totalRevenue).to.equal(1500);
      expect(result.totalExpenses).to.equal(1100);
    });

    it('should return zero totals for empty policy area', () => {
      const policyArea: PolicyArea = { objectives: [] };
      const result = computePolicyAreaBudget(policyArea);
      expect(result.totalRevenue).to.equal(0);
      expect(result.totalExpenses).to.equal(0);
    });
  });

  describe('computeProgramBudget', () => {
    it('should compute total revenue and expenses across all policy areas', () => {
      const program: Program = {
        id: '1',
        slogan: 'Test Program',
        description: 'Test Description',
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 'author1',
        policyAreas: {
          economy: {
            objectives: [
              { label: 'Eco 1', details: 'Details 1', budget: { revenue: 1000, expenses: 800 } },
              { label: 'Eco 2', details: 'Details 2', budget: { revenue: 500, expenses: 300 } }
            ]
          },
          social: {
            objectives: [
              { label: 'Social 1', details: 'Details 1', budget: { revenue: 2000, expenses: 1500 } }
            ]
          },
          education: { objectives: [] }
        },
        financialValidation: {
          totalBudget: 0,
          isBalanced: false,
          reviewComments: []
        },
        metrics: {
          publicSupport: 0,
          feasibilityScore: 0,
          votes: 0
        }
      };

      const result = computeProgramBudget(program);
      expect(result.totalRevenue).to.equal(3500); // 1000 + 500 + 2000
      expect(result.totalExpenses).to.equal(2600); // 800 + 300 + 1500
    });

    it('should return zero totals for program with empty policy areas', () => {
      const program: Program = {
        id: '1',
        slogan: 'Test Program',
        description: 'Test Description',
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 'author1',
        policyAreas: {
          economy: { objectives: [] },
          social: { objectives: [] }
        },
        financialValidation: {
          totalBudget: 0,
          isBalanced: false,
          reviewComments: []
        },
        metrics: {
          publicSupport: 0,
          feasibilityScore: 0,
          votes: 0
        }
      };

      const result = computeProgramBudget(program);
      expect(result.totalRevenue).to.equal(0);
      expect(result.totalExpenses).to.equal(0);
    });
  });
}); 