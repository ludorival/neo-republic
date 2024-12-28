
import { Program } from "@/domain/models/program";
import { User } from "@/domain/models/user";
import { Vote } from "@/domain/models/vote";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./clientApp";
import { FirebaseCRUDRepository } from "./FirebaseCRUDRepository";
import { ProgramRepository } from "@/domain/repositories/program";
import { UserRepository } from "@/domain/repositories/user";
import { VoteRepository } from "@/domain/repositories/vote";

const firestore = getFirestore(firebaseApp);

export const users : UserRepository = new FirebaseCRUDRepository<string, User>(firestore, 'users');
export const programs : ProgramRepository = new FirebaseCRUDRepository<string, Program>(firestore, 'programs');
export const votes : VoteRepository = new FirebaseCRUDRepository<string, Vote>(firestore, 'votes');
