export interface User {
  id: string;
  role: 'admin' | 'reviewer' | 'citizen';
  email: string;
  displayName: string;
  createdAt: Date;
  votingHistory?: string[]; // Array of program IDs
  submittedPrograms?: string[]; // Array of program IDs
  profile?: {
    avatar?: string;
    bio?: string;
    expertise?: string[];
  };
} 