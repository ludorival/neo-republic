import {
  assertSucceeds,
  assertFails,
  initializeTestEnvironment,
  RulesTestContext,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import { getDoc, setDoc, updateDoc } from 'firebase/firestore';
import * as fs from 'fs';
import { describe, before, beforeEach, after, it } from 'mocha';

describe('Firestore Security Rules', function() {
  // Increase timeout for setup
  this.timeout(10000);

  let testEnv: RulesTestEnvironment;
  let adminContext: RulesTestContext;
  let userContext: RulesTestContext;
  let reviewerContext: RulesTestContext;
  let unauthContext: RulesTestContext;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "neo-republic-project",
      firestore: {
        rules: fs.readFileSync('firestore.rules', 'utf8'),
        host: 'localhost',
        port: 8080
      }
    });
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
    
    // Create contexts with proper claims
    adminContext = testEnv.authenticatedContext('admin-uid', { email: 'admin@test.com' });
    userContext = testEnv.authenticatedContext('user-uid', { email: 'user@test.com' });
    reviewerContext = testEnv.authenticatedContext('reviewer-uid', { email: 'reviewer@test.com' });
    unauthContext = testEnv.unauthenticatedContext();

    // First, create users collection with admin bypass
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(db.doc('users/admin-uid'), {
        role: 'admin',
        email: 'admin@test.com',
        displayName: 'Admin User',
        createdAt: new Date()
      });
      await setDoc(db.doc('users/reviewer-uid'), {
        role: 'reviewer',
        email: 'reviewer@test.com',
        displayName: 'Reviewer User',
        createdAt: new Date()
      });
      await setDoc(db.doc('users/user-uid'), {
        role: 'citizen',
        email: 'user@test.com',
        displayName: 'Regular User',
        createdAt: new Date()
      });
    });
  });

  after(async () => {
    await testEnv.cleanup();
  });

  describe('Programs Collection', () => {
    it('should allow users to read published programs', async () => {
      // Create the published program with security rules disabled
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        await setDoc(db.doc('programs/test-program'), {
          status: 'published',
          authorId: 'admin-uid',
          createdAt: new Date(),
          updatedAt: new Date(),
          policyAreas: {}
        });
      });

      // Now test reading with unauthenticated user
      const unAuthDb = unauthContext.firestore();
      await assertSucceeds(
        getDoc(unAuthDb.doc('programs/test-program'))
      );
    });

    it('should allow authors to create draft programs', async () => {
      const userDb = userContext.firestore();
      
      const programData = {
        status: 'draft',
        authorId: 'user-uid',
        createdAt: new Date(),
        updatedAt: new Date(),
        policyAreas: {}
      };

      await assertSucceeds(
        setDoc(userDb.doc('programs/draft-program'), programData)
      );
    });

    it('should prevent creating non-draft programs', async () => {
      const userDb = userContext.firestore();
      
      const programData = {
        status: 'published',
        authorId: 'user-uid',
        createdAt: new Date(),
        updatedAt: new Date(),
        policyAreas: {}
      };

      await assertFails(
        setDoc(userDb.doc('programs/published-program'), programData)
      );
    });
  });

  describe('Votes Collection', () => {
    it('should allow authenticated users to vote once per program', async () => {
      const userDb = userContext.firestore();
      const voteId = `user-uid_program-1`;

      const voteData = {
        userId: 'user-uid',
        programId: 'program-1',
        timestamp: new Date(),
        rating: 5
      };

      // First vote should succeed
      await assertSucceeds(
        setDoc(userDb.doc(`votes/${voteId}`), voteData)
      );

      // Second vote should fail
      await assertFails(
        setDoc(userDb.doc('votes/another-vote'), {
          ...voteData,
          rating: 3
        })
      );
    });

    it('should allow users to update only feedback in their votes', async () => {
      // Create initial vote with security rules disabled
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        const voteId = `user-uid_program-1`;
        
        await setDoc(db.doc(`votes/${voteId}`), {
          userId: 'user-uid',
          programId: 'program-1',
          timestamp: new Date(),
          rating: 5
        });
      });

      const userDb = userContext.firestore();
      const voteId = `user-uid_program-1`;

      // Should succeed: updating only feedback
      await assertSucceeds(
        updateDoc(userDb.doc(`votes/${voteId}`), {
          feedback: 'Updated feedback'
        })
      );

      // Should fail: trying to update rating
      await assertFails(
        updateDoc(userDb.doc(`votes/${voteId}`), {
          rating: 3
        })
      );
    });
  });

  describe('Users Collection', () => {
    it('should allow users to read other user profiles', async () => {
      const userDb = userContext.firestore();
      await assertSucceeds(
        getDoc(userDb.doc('users/admin-uid'))
      );
    });

    it('should allow users to update their own profiles', async () => {
      const userDb = userContext.firestore();
      await assertSucceeds(
        updateDoc(userDb.doc('users/user-uid'), {
          displayName: 'Updated Name'
        })
      );
    });

    it('should prevent users from updating other profiles', async () => {
      const userDb = userContext.firestore();
      await assertFails(
        updateDoc(userDb.doc('users/admin-uid'), {
          displayName: 'Hacked Name'
        })
      );
    });
  });
}); 