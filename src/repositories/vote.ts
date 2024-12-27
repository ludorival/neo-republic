import { doc, setDoc, updateDoc } from 'firebase/firestore';
import {FirebaseFirestore} from "@firebase/firestore-types";

export interface Vote {
  userId: string;
  programId: string;
  timestamp: Date;
  rating: number;
  feedback?: string;
}

export class VoteRepository {
  private readonly COLLECTION = 'votes';

  constructor(private readonly db: FirebaseFirestore) {}

  async createVote(vote: Vote): Promise<void> {
    const voteId = `${vote.userId}_${vote.programId}`;
    await setDoc(doc(this.db, this.COLLECTION, voteId), vote);
  }

  async updateVoteFeedback(voteId: string, feedback: string): Promise<void> {
    await updateDoc(doc(this.db, this.COLLECTION, voteId), { feedback });
  }

  async updateVoteRating(voteId: string, rating: number): Promise<void> {
    await updateDoc(doc(this.db, this.COLLECTION, voteId), { rating });
  }
} 