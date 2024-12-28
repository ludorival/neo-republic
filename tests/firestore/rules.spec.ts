import { Program } from '@/domain/models/program';
import { User } from '@/domain/models/user';
import { Vote } from '@/domain/models/vote';
import { PartialId } from '@/domain/repositories/baseRepository';
import { ProgramRepository } from '@/domain/repositories/program';
import { UserRepository } from '@/domain/repositories/user';
import { VoteRepository } from '@/domain/repositories/vote';
import { FirebaseCRUDRepository } from '@/infra/firebase/FirebaseCRUDRepository';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestContext,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import { expect, use } from 'chai';
import * as fs from 'fs';
import { after, before, beforeEach, describe, it } from 'mocha';

const DEFAULT_PROGRAM: PartialId<string, Program> = {
  slogan: 'Test Program',
  description: 'Test Description',
  status: 'draft' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  authorId: 'admin-uid',
  policyAreas: {},
  financialValidation: {
    totalBudget: 0,
    isBalanced: false,
    reviewComments: []
  },
  metrics: {
    publicSupport: 0,
    feasibilityScore: 0,
    votes: 0
  }
}
describe('Firestore Security Rules', function() {
  this.timeout(10000);

  let testEnv: RulesTestEnvironment;
  let adminContext: RulesTestContext;
  let userContext: RulesTestContext;
  let reviewerContext: RulesTestContext;
  let unauthContext: RulesTestContext;
  let userRepository: UserRepository;
  let voteRepository: VoteRepository;
  let programRepository: ProgramRepository;

  type ProgramInput = PartialId<string, Program>; 
  

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
    
    adminContext = testEnv.authenticatedContext('admin-uid', { email: 'admin@test.com' });
    userContext = testEnv.authenticatedContext('user-uid', { email: 'user@test.com' });
    reviewerContext = testEnv.authenticatedContext('reviewer-uid', { email: 'reviewer@test.com' });
    unauthContext = testEnv.unauthenticatedContext();

    await testEnv.withSecurityRulesDisabled(async (context) => {
      userRepository = new FirebaseCRUDRepository<string, User>(context.firestore(), 'users');
      
      await userRepository.create({
        id: 'admin-uid',
        role: 'admin',
        email: 'admin@test.com',
        displayName: 'Admin User',
        createdAt: new Date()
      });
      
      await userRepository.create({
        id: 'reviewer-uid',
        role: 'reviewer',
        email: 'reviewer@test.com',
        displayName: 'Reviewer User',
        createdAt: new Date()
      });
      
      await userRepository.create({
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
      let programId: string = '';
      await testEnv.withSecurityRulesDisabled(async (context) => {
        programRepository = new FirebaseCRUDRepository<string, Program>(context.firestore(), 'programs');
        const program = await programRepository.create({...DEFAULT_PROGRAM, authorId: 'admin-uid', status: 'published'});
        programId = program.id;
      });

      programRepository = new FirebaseCRUDRepository<string, Program>(unauthContext.firestore(), 'programs');
      const program = await programRepository.read(programId);
      expect(program).to.not.be.null;

      await assertSucceeds(
        programRepository.findAllBy('status', '==', 'published')
      );
    });

    it('should allow authors to create draft programs', async () => {
      programRepository = new FirebaseCRUDRepository<string, Program>(userContext.firestore(), 'programs');
      
      await assertSucceeds(
        programRepository.create({...DEFAULT_PROGRAM, authorId: 'user-uid'})
      );
    });

    it('should prevent creating non-draft programs', async () => {
      programRepository = new FirebaseCRUDRepository<string, Program>(userContext.firestore(), 'programs');
      
      await assertSucceeds(
        programRepository.create({...DEFAULT_PROGRAM, authorId: 'user-uid'})
      );
    });

    it('should allow authors to delete their own draft programs', async () => {
      let programId: string = '';
      await testEnv.withSecurityRulesDisabled(async (context) => {
        programRepository = new FirebaseCRUDRepository<string, Program>(context.firestore(), 'programs');
        const program = await programRepository.create({...DEFAULT_PROGRAM, authorId: 'user-uid'});
        programId = program.id;
      });

      programRepository = new FirebaseCRUDRepository<string, Program>(userContext.firestore(), 'programs');
      await assertSucceeds(
        programRepository.delete(programId)
      );
    });

    it('should prevent non-authors from deleting programs', async () => {
      // Create a program owned by user-uid
      let programId: string = '';
      await testEnv.withSecurityRulesDisabled(async (context) => {
        programRepository = new FirebaseCRUDRepository<string, Program>(context.firestore(), 'programs');
        const program = await programRepository.create({...DEFAULT_PROGRAM, authorId: 'user-uid'});
        programId = program.id;
      });

      programRepository = new FirebaseCRUDRepository<string, Program>(reviewerContext.firestore(), 'programs');
      await assertFails(
        programRepository.delete(programId)
      );
    });
  });

  describe('Votes Collection', () => {
    it('should allow authenticated users to vote once per program', async () => {
      voteRepository = new FirebaseCRUDRepository<string, Vote>(userContext.firestore(), 'votes');

      const voteData = {
        id: 'user-uid_program-1',
        userId: 'user-uid',
        programId: 'program-1',
        timestamp: new Date(),
        rating: 5
      };

      await assertSucceeds(
        voteRepository.create(voteData)
      );

      await assertFails(
        voteRepository.create({
          ...voteData,
          rating: 3
        })
      );
    });

    it('should allow users to update only feedback in their votes', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        voteRepository = new FirebaseCRUDRepository<string, Vote>(context.firestore(), 'votes');
        
        await voteRepository.create({
          id: 'user-uid_program-1',
          userId: 'user-uid',
          programId: 'program-1',
          timestamp: new Date(),
          rating: 5
        });
      });

      voteRepository = new FirebaseCRUDRepository<string, Vote>(userContext.firestore(), 'votes');

      await assertSucceeds(
        voteRepository.update('user-uid_program-1', { feedback: 'Updated feedback' })
      );

      await assertFails(
        voteRepository.update('user-uid_program-1', { rating: 3 })
      );
    });
  });

  describe('Users Collection', () => {
    it('should allow users to read other user profiles', async () => {
      userRepository = new FirebaseCRUDRepository<string, User>(userContext.firestore(), 'users');
      
      await assertSucceeds(
        userRepository.read('admin-uid')
      );
    });

    it('should allow users to update their own profiles', async () => {
      userRepository = new FirebaseCRUDRepository<string, User>(userContext.firestore(), 'users');
      
      await assertSucceeds(
        userRepository.update('user-uid', {
          displayName: 'Updated Name'
        })
      );
    });

    it('should prevent users from updating other profiles', async () => {
      userRepository = new FirebaseCRUDRepository<string, User>(userContext.firestore(), 'users');
      
      await assertFails(
        userRepository.update('admin-uid', {
          displayName: 'Hacked Name'
        })
      );
    });
  });
}); 