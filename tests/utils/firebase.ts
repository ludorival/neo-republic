import {
  initializeTestEnvironment,
  RulesTestContext,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import fs from "fs";
let testEnv: RulesTestEnvironment;
let adminContext: RulesTestContext;
let userContext: RulesTestContext;
let reviewerContext: RulesTestContext;
let unauthContext: RulesTestContext;


export async function initializeFirebaseTestEnvironment(
  projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
) {
  if (testEnv) return testEnv;
  testEnv = await initializeTestEnvironment({
    projectId: projectId || "neo-republic-project",
    firestore: {
      rules: fs.readFileSync("firestore.rules", "utf8"),
      host: "localhost",
      port: 8080,
    },
  });
  return testEnv;
}

export async function getContexts(projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  const testEnv = await initializeFirebaseTestEnvironment(projectId);
  adminContext = adminContext || testEnv.authenticatedContext('admin-uid', { email: 'admin@test.com' });
  userContext = userContext || testEnv.authenticatedContext('user-uid', { email: 'user@test.com' });
  reviewerContext = reviewerContext || testEnv.authenticatedContext('reviewer-uid', { email: 'reviewer@test.com' });
  unauthContext = unauthContext || testEnv.unauthenticatedContext();

  return { adminContext, userContext, reviewerContext, unauthContext };
}


export async function clearFirestoreData() {
  if (!testEnv) throw new Error("Firebase test environment not initialized");
  await testEnv.clearFirestore();
}

export async function cleanup() {
  if (!testEnv) throw new Error("Firebase test environment not initialized");
  await testEnv.cleanup();
}
