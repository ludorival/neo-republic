import { Program } from "@/domain/models/program";
import { CRUDRepository } from "./baseRepository";


export interface ProgramRepository extends CRUDRepository<string, Program> {
}
