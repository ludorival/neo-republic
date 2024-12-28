import { Firestore, DocumentData, DocumentReference, QuerySnapshot } from 'firebase/firestore';
import * as firestore from 'firebase/firestore';

// Create mock data store
export const mockDataStore: { [collection: string]: { [doc: string]: DocumentData } } = {};

// Create Firestore stubs
export function createFirestoreStubs() {
  // Mock document reference
  const mockDoc: DocumentReference = {
    id: 'mock-doc-id',
    path: 'mock/path',
    parent: {} as any,
    type: 'document',
    firestore: {} as any,
    converter: null,
    withConverter: () => mockDoc,
  };

  // Stub Firestore methods
  cy.stub(firestore, 'getFirestore').returns({} as Firestore);
  
  cy.stub(firestore, 'collection').returns({} as any);
  
  cy.stub(firestore, 'doc').returns(mockDoc);
  
  cy.stub(firestore, 'getDoc').callsFake(async () => ({
    exists: () => true,
    data: () => ({}),
    id: 'mock-doc-id',
    ref: mockDoc,
    metadata: {} as any,
  }));
  
  cy.stub(firestore, 'setDoc').callsFake(async (docRef, data) => {
    const path = docRef.path.split('/');
    const collection = path[0];
    const docId = path[1];
    
    if (!mockDataStore[collection]) {
      mockDataStore[collection] = {};
    }
    mockDataStore[collection][docId] = data;
  });
  
  cy.stub(firestore, 'updateDoc').callsFake(async (docRef, data) => {
    const path = docRef.path.split('/');
    const collection = path[0];
    const docId = path[1];
    
    if (!mockDataStore[collection]?.[docId]) {
      throw new Error('Document does not exist');
    }
    mockDataStore[collection][docId] = {
      ...mockDataStore[collection][docId],
      ...data,
    };
  });
  
  cy.stub(firestore, 'deleteDoc').callsFake(async (docRef) => {
    const path = docRef.path.split('/');
    const collection = path[0];
    const docId = path[1];
    
    if (mockDataStore[collection]?.[docId]) {
      delete mockDataStore[collection][docId];
    }
  });
  
  cy.stub(firestore, 'query').returns({} as any);
  
  cy.stub(firestore, 'where').returns({} as any);
  
  cy.stub(firestore, 'getDocs').callsFake(async () => ({
    docs: [],
    size: 0,
    empty: true,
    forEach: () => {},
  } as unknown as QuerySnapshot));
}

// Clear mock data store
export function clearMockDataStore() {
  Object.keys(mockDataStore).forEach(key => delete mockDataStore[key]);
} 