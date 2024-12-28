/**
 * Represents the status of a program in the system
 */
export type ProgramStatus = 'draft' | 'under_review' | 'approved' | 'rejected' | 'published';

/**
 * Represents an objective with amount and description
 */
export interface Objective {
  id?: string;
  description: string;
  budget: Budget;
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

/**
 * Represents a vote cast by a user
 */
export interface Vote {
  id: string;
  userId: string;
  programId: string;
  timestamp: Date;
  rating: number;
  feedback?: string;
}

/**
 * Represents a user in the system
 */
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'citizen' | 'admin' | 'reviewer';
  createdAt: Date;
  votingHistory: string[]; // Array of program IDs
  submittedPrograms: string[]; // Array of program IDs
  profile: {
    avatar?: string;
    bio?: string;
    expertise?: string[];
  };
} 