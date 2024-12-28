
export interface Vote {
  id: string;
  userId: string;
  programId: string;
  timestamp: Date;
  rating: number;
  feedback?: string;
}
