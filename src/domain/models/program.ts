/**
 * Represents the status of a program in the system
 */
export type ProgramStatus = 'draft' | 'under_review' | 'approved' | 'rejected' | 'published';

/**
 * Represents an objective with amount and description
 */
export interface Objective {
  id?: string;
  label: string;
  budget: Budget;
  position: number;
}

export interface Budget {
  revenue: number;
  expenses: number;
}

/**
 * Base interface for all policy areas
 */
export interface PolicyArea {
  id: string;
  title: string;
  description: string;
  position: number;
  objectives: Record<string, Objective>;
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
