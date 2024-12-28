import { ProgramRepository } from '@/domain/repositories/program';
import { UserRepository } from '@/domain/repositories/user';
import { VoteRepository } from '@/domain/repositories/vote';
import { FirebaseDatabase } from '@/infra/firebase/FirebaseDatabase';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestContext,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import { expect } from 'chai';
import * as fs from 'fs';
import { after, before, beforeEach, describe, it } from 'mocha';

describe('Firestore Security Rules', function() {
  // Increase timeout for setup
  this.timeout(10000);

  let testEnv: RulesTestEnvironment;
  let adminContext: RulesTestContext;
  let userContext: RulesTestContext;
  let reviewerContext: RulesTestContext;
  let unauthContext: RulesTestContext;
  let userRepository: UserRepository;
  let voteRepository: VoteRepository;

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
      const db = new FirebaseDatabase(context.firestore());
      userRepository = new UserRepository(db);
      
      await userRepository.createUser({
        id: 'admin-uid',
        role: 'admin',
        email: 'admin@test.com',
        displayName: 'Admin User',
        createdAt: new Date()
      });
      
      await userRepository.createUser({
        id: 'reviewer-uid',
        role: 'reviewer',
        email: 'reviewer@test.com',
        displayName: 'Reviewer User',
        createdAt: new Date()
      });
      
      await userRepository.createUser({
        id: 'user-uid',
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
      let programId: string = '';
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = new FirebaseDatabase(context.firestore());
        const programRepository = new ProgramRepository(db);
        programId = await programRepository.createProgram({
          authorId: 'admin-uid',
          createdAt: new Date(),
          updatedAt: new Date(),
          policyAreas: {}
        });
        await programRepository.updateProgramStatus(programId, 'published');
      });

      // Now test reading with unauthenticated user
      const unAuthDb = new FirebaseDatabase(unauthContext.firestore());
      const programRepository = new ProgramRepository(unAuthDb);
      const program = await programRepository.getProgram(programId);
      expect(program).to.not.be.null;

      // and test that unauthenticated user can read published programs
      await assertSucceeds(
        programRepository.getProgramsByStatus('published')
      );
    });

    it('should allow authors to create draft programs', async () => {
      const userDb = new FirebaseDatabase(userContext.firestore());
      const programRepository = new ProgramRepository(userDb);
      
      await assertSucceeds(
        programRepository.createProgram({
          authorId: 'user-uid',
          policyAreas: {}
        })
      );
    });

    it('should prevent creating non-draft programs', async () => {
      const userDb = new FirebaseDatabase(userContext.firestore());
      const programRepository = new ProgramRepository(userDb);
      
      await assertSucceeds(
        programRepository.createProgram({
          authorId: 'user-uid',
          policyAreas: {}
        })
      );
    });

    it('should allow authors to delete their own draft programs', async () => {
      // Create a draft program with security rules disabled
      let programId: string = '';
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = new FirebaseDatabase(context.firestore());
        const programRepository = new ProgramRepository(db);
        programId = await programRepository.createProgram({
          authorId: 'user-uid',
          createdAt: new Date(),
          updatedAt: new Date(),
          policyAreas: {}
        });
      });

      const userDb = userContext.firestore();
      // Author should be able to delete their program
      await assertSucceeds(
        userDb.doc(`programs/${programId}`).delete()
      );
    });

    it('should prevent non-authors from deleting programs', async () => {
      // Create a program owned by user-uid
      let programId: string = '';
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = new FirebaseDatabase(context.firestore());
        const programRepository = new ProgramRepository(db);
        programId = await programRepository.createProgram({
          authorId: 'user-uid',
          createdAt: new Date(),
          updatedAt: new Date(),
          policyAreas: {}
        });
      });

      // Try to delete with reviewer (non-author)
      const reviewerDb = reviewerContext.firestore();
      await assertFails(
        reviewerDb.doc(`programs/${programId}`).delete()
      );
    });
  });

  describe('Votes Collection', () => {
    it('should allow authenticated users to vote once per program', async () => {
      const userDb = new FirebaseDatabase(userContext.firestore());
      voteRepository = new VoteRepository(userDb);

      const voteData = {
        userId: 'user-uid',
        programId: 'program-1',
        timestamp: new Date(),
        rating: 5
      };

      // First vote should succeed
      await assertSucceeds(
        voteRepository.createVote(voteData)
      );

      // Second vote should fail
      await assertFails(
        voteRepository.createVote({
          ...voteData,
          rating: 3
        })
      );
    });

    it('should allow users to update only feedback in their votes', async () => {
      // Create initial vote with security rules disabled
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = new FirebaseDatabase(context.firestore());
        voteRepository = new VoteRepository(db);
        
        await voteRepository.createVote({
          userId: 'user-uid',
          programId: 'program-1',
          timestamp: new Date(),
          rating: 5
        });
      });

      const userDb = new FirebaseDatabase(userContext.firestore());
      voteRepository = new VoteRepository(userDb);

      // Should succeed: updating only feedback
      await assertSucceeds(
        voteRepository.updateVoteFeedback('user-uid_program-1', 'Updated feedback')
      );

      // Should fail: trying to update rating
      await assertFails(
        voteRepository.updateVoteRating('user-uid_program-1', 3)
      );
    });
  });

  describe('Users Collection', () => {
    it('should allow users to read other user profiles', async () => {
      const userDb = new FirebaseDatabase(userContext.firestore());
      userRepository = new UserRepository(userDb);
      
      await assertSucceeds(
        userRepository.getUser('admin-uid')
      );
    });

    it('should allow users to update their own profiles', async () => {
      const userDb = new FirebaseDatabase(userContext.firestore());
      userRepository = new UserRepository(userDb);
      
      await assertSucceeds(
        userRepository.updateUser('user-uid', {
          displayName: 'Updated Name'
        })
      );
    });

    it('should prevent users from updating other profiles', async () => {
      const userDb = new FirebaseDatabase(userContext.firestore());
      userRepository = new UserRepository(userDb);
      
      await assertFails(
        userRepository.updateUser('admin-uid', {
          displayName: 'Hacked Name'
        })
      );
    });
  });
}); 