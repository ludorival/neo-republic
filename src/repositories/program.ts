import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  updateDoc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import * as types from "@firebase/firestore-types";
import { Program, ProgramStatus } from "@/types/program";

export class ProgramRepository {
  private readonly COLLECTION = "programs";

  constructor(private readonly db: types.FirebaseFirestore) {}

  /**
   * Creates a new program in the database
   * @param program The program data to create
   * @returns The ID of the created program
   */
  async createProgram(program: Partial<Program>): Promise<string> {
    const programRef = doc(collection(this.db, this.COLLECTION));

    const programData = {
      ...program,
      id: programRef.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
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

    await setDoc(programRef, programData);
    return programRef.id;
  }

  async getProgramsByStatus(status: ProgramStatus): Promise<Program[]> {
    const programsQuery = query(
      collection(this.db, this.COLLECTION),
      where("status", "==", status)
    );

    const snapshot = await getDocs(programsQuery);
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
    const programRef = doc(this.db, this.COLLECTION, programId);
    await updateDoc(programRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Retrieves a single program by ID
   * @param programId The ID of the program to retrieve
   * @returns The program data or null if not found
   */
  async getProgram(programId: string): Promise<Program | null> {
    const programRef = doc(this.db, this.COLLECTION, programId);
    const programDoc = await getDoc(programRef);

    if (!programDoc.exists()) {
      return null;
    }

    return {
      ...programDoc.data(),
      id: programDoc.id,
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
    const programRef = doc(this.db, this.COLLECTION, programId);

    await updateDoc(programRef, {
      policyAreas,
      updatedAt: Timestamp.now(),
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
    const programRef = doc(this.db, this.COLLECTION, programId);

    await updateDoc(programRef, {
      financialValidation: validation,
      updatedAt: Timestamp.now(),
    });
  }
}
