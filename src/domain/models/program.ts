/**
 * Represents the status of a program in the system
 */
export type ProgramStatus = 'draft' | 'under_review' | 'approved' | 'rejected' | 'published';

/**
 * Represents an objective with amount and description
 */
export interface Objective {
  label: string;
  budget: {revenue: number, expenses: number};
}



/**
 * Base interface for all policy areas
 */
export interface PolicyArea {
  objectives: Objective[];
  implementation?: {
    timeline: string;
    milestones: string[];
    keyMetrics: string[];
  };
}

/**
 * Represents a complete program proposal
 */
export interface Program {
  id: string;
  slogan: string;
  description: string;
  status: ProgramStatus;
  createdAt: Date;
  updatedAt: Date;
  authorId: string; // Hidden from voters
  
  // Map of policy area ID to PolicyArea
  policyAreas: Record<string, PolicyArea>;

  // Validation and Metrics
  financialValidation: {
    totalBudget: number;
    isBalanced: boolean;
    reviewComments: string[];
    lastReviewDate?: Date;
  };
  
  metrics: {
    publicSupport: number;
    feasibilityScore: number;
    implementationProgress?: number;
    votes: number;
  };
}

export function createProgram({slogan, description, authorId, policyAreas}: {slogan?: string, description?: string, authorId: string, policyAreas: string[]}): Omit<Program, 'id'> {
  return {
    slogan: slogan || '',
    description: description || '',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: authorId,
    policyAreas: policyAreas.reduce((acc, policyArea) => {
      acc[policyArea] = {
        objectives: [],
      };
      return acc;
    }, {} as Record<string, PolicyArea>),
    financialValidation: {
      totalBudget: 0,
      isBalanced: false,
      reviewComments: [],
    },
    metrics: {
      publicSupport: 0,
      feasibilityScore: 0,
      votes: 0,
    },
  };
}