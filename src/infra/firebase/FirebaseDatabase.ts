import { Database, Collection, Document, Query, QuerySnapshot, QueryDocumentSnapshot, WhereOperator } from '@/domain/repositories/database';
import { Firestore as FirestoreApp, DocumentData } from 'firebase/firestore';
import type { FirebaseFirestore } from '@firebase/firestore-types';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';

type AnyFirestore = FirestoreApp | FirebaseFirestore;

class FirebaseDocument<T extends DocumentData> implements Document<T> {
  constructor(private firestore: AnyFirestore, private collectionName: string, public id: string) {}

  async exists(): Promise<boolean> {
    const docRef = doc(this.firestore as FirestoreApp, this.collectionName, this.id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }

  async data(): Promise<T> {
    const docRef = doc(this.firestore as FirestoreApp, this.collectionName, this.id);
    const docSnap = await getDoc(docRef);
    return docSnap.data() as T;
  }

  async set(data: T): Promise<void> {
    const docRef = doc(this.firestore as FirestoreApp, this.collectionName, this.id);
    await setDoc(docRef, data);
  }

  async update(data: Partial<T>): Promise<void> {
    const docRef = doc(this.firestore as FirestoreApp, this.collectionName, this.id);
    await updateDoc(docRef, data as DocumentData);
  }

  async delete(): Promise<void> {
    const docRef = doc(this.firestore as FirestoreApp, this.collectionName, this.id);
    await deleteDoc(docRef);
  }
}

class FirebaseQueryDocumentSnapshot<T extends DocumentData> implements QueryDocumentSnapshot<T> {
  constructor(
    private snapshot: DocumentData,
    public readonly id: string,
    public readonly exists: boolean
  ) {}

  data(): T {
    return this.snapshot as T;
  }
}

class FirebaseQuerySnapshot<T extends DocumentData> implements QuerySnapshot<T> {
  constructor(public docs: QueryDocumentSnapshot<T>[]) {}
}

class FirebaseQuery<T extends DocumentData> implements Query<T> {
  constructor(
    private firestore: AnyFirestore,
    private collectionName: string,
    private fieldPath: keyof T,
    private opStr: WhereOperator,
    private value: T[keyof T]
  ) {}

  async get(): Promise<QuerySnapshot<T>> {
    const q = query(
      collection(this.firestore as FirestoreApp, this.collectionName),
      where(this.fieldPath as string, this.opStr, this.value)
    );
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map(
      doc => new FirebaseQueryDocumentSnapshot<T>(doc.data(), doc.id, doc.exists())
    );
    return new FirebaseQuerySnapshot<T>(docs);
  }
}

class FirebaseCollection<T extends DocumentData> implements Collection<T> {
  constructor(private firestore: AnyFirestore, private name: string) {}

  doc(id: string): Document<T> {
    return new FirebaseDocument<T>(this.firestore, this.name, id);
  }

  newDoc(): Document<T> {
    const docRef = doc(collection(this.firestore as FirestoreApp, this.name));
    return new FirebaseDocument<T>(this.firestore, this.name, docRef.id);
  }

  where(field: keyof T, operator: WhereOperator, value: T[keyof T]): Query<T> {
    return new FirebaseQuery<T>(this.firestore, this.name, field, operator, value);
  }
}

export class FirebaseDatabase implements Database {
  constructor(private firestore: AnyFirestore) {}

  collection<T extends DocumentData>(name: string): Collection<T> {
    return new FirebaseCollection<T>(this.firestore, name);
  }

  doc<T extends DocumentData>(collectionName: string, id: string): Document<T> {
    return new FirebaseDocument<T>(this.firestore, collectionName, id);
  }
} 