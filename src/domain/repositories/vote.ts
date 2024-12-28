import { Vote } from "@/domain/models/vote";
import { CRUDRepository } from "./baseRepository";

export type VoteRepository = CRUDRepository<string, Vote>;
