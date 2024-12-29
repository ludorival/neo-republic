import { Program } from "@/domain/models/program";
import { CRUDRepository } from "./baseRepository";


export type ProgramRepository = CRUDRepository<string, Program>;
