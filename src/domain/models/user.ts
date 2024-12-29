export interface User {
  id: string;
  role: 'admin' | 'reviewer' | 'citizen';
  email: string;
  displayName: string;
  createdAt: Date;
  votingHistory?: string[]; // Array of program IDs
  submittedProgram?: string; // ID of the program the user has submitted
  profile?: {
    avatar?: string;
    bio?: string;
    expertise?: string[];
  };
} 