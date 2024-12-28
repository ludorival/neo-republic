import { Program, ProgramStatus } from "@/domain/models/program";
import { Database } from "./database";

export class ProgramRepository {
  private readonly COLLECTION = "programs";

  constructor(private readonly db: Database) {}

  /**
   * Creates a new program in the database
   * @param program The program data to create
   * @returns The ID of the created program
   */
  async createProgram(program: Partial<Program>): Promise<string> {
    const programRef = this.db.collection(this.COLLECTION).newDoc();

    const programData = {
      ...program,
      id: programRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "draft",
      metrics: {
        publicSupport: 0,
        feasibilityScore: 0,
        votes: 0,
      },
      financialValidation: {
        totalBudget: 0,
        isBalanced: false,
        reviewComments: [],
      },
    };

    await programRef.set(programData);
    return programRef.id;
  }

  async getProgramsByStatus(status: ProgramStatus): Promise<Program[]> {
    const programsQuery = this.db.collection(this.COLLECTION).where("status", "==", status);

    const snapshot = await programsQuery.get();
    return snapshot.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as Program)
    );
  }

  /**
   * Updates the status of a program
   * @param programId The ID of the program to update
   * @param status The new status to set
   */
  async updateProgramStatus(
    programId: string,
    status: ProgramStatus
  ): Promise<void> {
    const programRef = this.db.doc(this.COLLECTION, programId);
    await programRef.update({
      status,
      updatedAt: new Date(),
    });
  }

  /**
   * Retrieves a single program by ID
   * @param programId The ID of the program to retrieve
   * @returns The program data or null if not found
   */
  async getProgram(programId: string): Promise<Program | null> {
    const programRef = this.db.doc(this.COLLECTION, programId);
    const exists = await programRef.exists();

    if (!exists) {
      return null;
    }

    const data = await programRef.data();
    return {
      ...data,
      id: programRef.id,
    } as Program;
  }

  /**
   * Updates a program's policy areas
   * @param programId The ID of the program to update
   * @param policyAreas The updated policy areas data
   */
  async updateProgramPolicyAreas(
    programId: string,
    policyAreas: Program["policyAreas"]
  ): Promise<void> {
    const programRef = this.db.doc(this.COLLECTION, programId);

    await programRef.update({
      policyAreas,
      updatedAt: new Date(),
    });
  }

  /**
   * Updates a program's financial validation
   * @param programId The ID of the program to update
   * @param validation The updated validation data
   */
  async updateProgramValidation(
    programId: string,
    validation: Program["financialValidation"]
  ): Promise<void> {
    const programRef = this.db.doc(this.COLLECTION, programId);

    await programRef.update({
      financialValidation: validation,
      updatedAt: new Date(),
    });
  }
}
