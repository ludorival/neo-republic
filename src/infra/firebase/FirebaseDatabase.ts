import { Database, Collection, Document, Query, QuerySnapshot, QueryDocumentSnapshot } from '@/domain/repositories/database';
import { Firestore as FirestoreApp } from 'firebase/firestore';
import type { FirebaseFirestore } from '@firebase/firestore-types';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs, DocumentData } from 'firebase/firestore';

type AnyFirestore = FirestoreApp | FirebaseFirestore;

class FirebaseDocument implements Document {
  constructor(private firestore: AnyFirestore, private collectionName: string, public id: string) {}

  async exists(): Promise<boolean> {
    const docRef = doc(this.firestore as any, this.collectionName, this.id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }

  async data(): Promise<any> {
    const docRef = doc(this.firestore as any, this.collectionName, this.id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  }

  async set(data: any): Promise<void> {
    const docRef = doc(this.firestore as any, this.collectionName, this.id);
    await setDoc(docRef, data);
  }

  async update(data: any): Promise<void> {
    const docRef = doc(this.firestore as any, this.collectionName, this.id);
    await updateDoc(docRef, data);
  }

  async delete(): Promise<void> {
    const docRef = doc(this.firestore as any, this.collectionName, this.id);
    await deleteDoc(docRef);
  }
}

class FirebaseQueryDocumentSnapshot implements QueryDocumentSnapshot {
  constructor(
    private snapshot: DocumentData,
    public readonly id: string,
    public readonly exists: boolean
  ) {}

  data(): any {
    return this.snapshot;
  }
}

class FirebaseQuerySnapshot implements QuerySnapshot {
  constructor(public docs: QueryDocumentSnapshot[]) {}
}

class FirebaseQuery implements Query {
  constructor(
    private firestore: AnyFirestore,
    private collectionName: string,
    private fieldPath: string,
    private opStr: string,
    private value: any
  ) {}

  async get(): Promise<QuerySnapshot> {
    const q = query(
      collection(this.firestore as any, this.collectionName),
      where(this.fieldPath, this.opStr as any, this.value)
    );
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map(
      doc => new FirebaseQueryDocumentSnapshot(doc.data(), doc.id, doc.exists())
    );
    return new FirebaseQuerySnapshot(docs);
  }
}

class FirebaseCollection implements Collection {
  constructor(private firestore: AnyFirestore, private name: string) {}

  doc(id: string): Document {
    return new FirebaseDocument(this.firestore, this.name, id);
  }

  newDoc(): Document {
    const docRef = doc(collection(this.firestore as any, this.name));
    return new FirebaseDocument(this.firestore, this.name, docRef.id);
  }

  where(field: string, operator: string, value: any): Query {
    return new FirebaseQuery(this.firestore, this.name, field, operator, value);
  }
}

export class FirebaseDatabase implements Database {
  constructor(private firestore: AnyFirestore) {}

  collection(name: string): Collection {
    return new FirebaseCollection(this.firestore, name);
  }

  doc(collectionName: string, id: string): Document {
    return new FirebaseDocument(this.firestore, collectionName, id);
  }
} 