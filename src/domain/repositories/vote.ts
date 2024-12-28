import { Database } from './database';

export interface Vote {
  userId: string;
  programId: string;
  timestamp: Date;
  rating: number;
  feedback?: string;
}

export class VoteRepository {
  private readonly COLLECTION = 'votes';

  constructor(private readonly db: Database) {}

  async createVote(vote: Vote): Promise<void> {
    const voteId = `${vote.userId}_${vote.programId}`;
    await this.db.doc<Vote>(this.COLLECTION, voteId).set(vote);
  }

  async updateVoteFeedback(voteId: string, feedback: string): Promise<void> {
    await this.db.doc<Vote>(this.COLLECTION, voteId).update({ feedback });
  }

  async updateVoteRating(voteId: string, rating: number): Promise<void> {
    await this.db.doc<Vote>(this.COLLECTION, voteId).update({ rating });
  }
} 