import { Vote } from "@/domain/models/vote";
import { CRUDRepository } from "./baseRepository";

export interface VoteRepository extends CRUDRepository<string, Vote> {
}
