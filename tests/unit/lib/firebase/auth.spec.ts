import { expect, use } from 'chai';
import { Auth, GoogleAuthProvider, User, UserCredential } from 'firebase/auth';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { FirebaseAuth } from '@/lib/firebase/auth';

// Add Sinon assertions to Chai
use(sinonChai);

describe('Firebase Authentication', () => {
  let mockUser: Partial<User>;
  let mockAuth: Auth;
  let authService: FirebaseAuth;
  let mockSignInWithPopup: sinon.SinonStub;
  beforeEach(() => {
    mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg'
    };

    // Create a complete mock auth object
    const auth = {
      onAuthStateChanged: sinon.stub(),
      signInWithPopup: sinon.stub(),
      signOut: sinon.stub(),
      app: {} as any,
      name: 'mock-auth',
      config: {} as any,
      currentUser: null,
      languageCode: null,
      tenantId: null,
      settings: {} as any,
      setPersistence: sinon.stub(),
      useDeviceLanguage: sinon.stub(),
      updateCurrentUser: sinon.stub(),
      beforeAuthStateChanged: sinon.stub(),
      onIdTokenChanged: sinon.stub(),
      authStateReady: sinon.stub().resolves(),
      emulatorConfig: null
    };

    // Cast to unknown first, then to Auth to satisfy TypeScript
    mockAuth = auth as unknown as Auth;

    mockSignInWithPopup = sinon.stub()

    // Initialize the auth service with mock auth
    authService = new FirebaseAuth(mockAuth, mockSignInWithPopup);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('onAuthStateChanged', () => {
    it('should call callback when auth state changes', (done) => {
      const callback = (user: User | null) => {
        expect(user).to.deep.include(mockUser);
        done();
      };

      (mockAuth.onAuthStateChanged as sinon.SinonStub).callsFake((cb: (user: User | null) => void) => {
        cb(mockUser as User);
        return () => {}; // Return unsubscribe function
      });

      const unsubscribe = authService.onAuthStateChanged(callback);
      unsubscribe();
      
      expect(mockAuth.onAuthStateChanged).to.have.been.calledOnce;
    });

    it('should call callback with null when signed out', (done) => {
      const callback = (user: User | null) => {
        expect(user).to.be.null;
        done();
      };

      (mockAuth.onAuthStateChanged as sinon.SinonStub).callsFake((cb: (user: User | null) => void) => {
        cb(null);
        return () => {}; // Return unsubscribe function
      });

      const unsubscribe = authService.onAuthStateChanged(callback);
      unsubscribe();
      
      expect(mockAuth.onAuthStateChanged).to.have.been.calledOnce;
    });
  });

  describe('signInWithGoogle', () => {
    it('should successfully sign in with Google', async () => {
      const mockCredential: UserCredential = {
        user: mockUser as User,
        providerId: GoogleAuthProvider.PROVIDER_ID,
        operationType: 'signIn',
      };

     mockSignInWithPopup.resolves(mockCredential);

      const user = await authService.signInWithGoogle();
      expect(user).to.deep.include(mockUser);
      expect(mockSignInWithPopup).to.have.been.calledOnce;
    });

    it('should handle sign in errors', async () => {
      const error = new Error('Google sign in failed');
      mockSignInWithPopup.rejects(error);

      try {
        await authService.signInWithGoogle();
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
      expect(mockSignInWithPopup).to.have.been.calledOnce;
    });
  });

  describe('signOut', () => {
    it('should successfully sign out', async () => {
      (mockAuth.signOut as sinon.SinonStub).resolves();

      await authService.signOut();
      expect(mockAuth.signOut).to.have.been.calledOnce;
    });

    it('should handle sign out errors', async () => {
      const error = new Error('Sign out failed');
      (mockAuth.signOut as sinon.SinonStub).rejects(error);

      try {
        await authService.signOut();
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
      expect(mockAuth.signOut).to.have.been.calledOnce;
    });
  });
}); 