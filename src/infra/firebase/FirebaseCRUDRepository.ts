import { collection, deleteDoc, doc, DocumentData, Firestore, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { CRUDRepository, HasId, PartialId, WhereOperator } from '../../domain/repositories/baseRepository';
import type { FirebaseFirestore } from '@firebase/firestore-types';

type AnyFirestore = Firestore | FirebaseFirestore;
export class FirebaseCRUDRepository<I extends string | number, T extends HasId<I>> implements CRUDRepository<I, T> {
  constructor(
    private readonly db: AnyFirestore,
    private readonly collectionName: string
  ) {}

  async create(data: PartialId<I, T>): Promise<T> {
    const collectionRef = collection(this.db as Firestore, this.collectionName);
    const docRef = data.id ? 
      doc(collectionRef, String(data.id)) : 
      doc(collectionRef);

    const newData = { ...data, id: docRef.id as I } as T;
    try {
      await setDoc(docRef, newData);
    } catch (error) {
      console.error(error);
      throw error;
    }
    return newData;
  }

  async read(id: I): Promise<T | null> {
    const collectionRef = collection(this.db as Firestore, this.collectionName);
    const docRef = doc(collectionRef, String(id));
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { ...docSnap.data(), id } as T;
  }

  async update(id: I, data: Partial<T>): Promise<void> {
    const collectionRef = collection(this.db as Firestore, this.collectionName);
    const docRef = doc(collectionRef, String(id));
    await updateDoc(docRef, data as DocumentData);
  }

  async delete(id: I): Promise<void> {
    const collectionRef = collection(this.db as Firestore, this.collectionName);
    const docRef = doc(collectionRef, String(id));
    await deleteDoc(docRef);
  }

  async findAllBy(field: keyof T, operator: WhereOperator, value: T[keyof T]): Promise<T[]> {
    const collectionRef = collection(this.db as Firestore, this.collectionName);
    const q = query(
      collectionRef,
      where(field as string, operator, value)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as T));
  }
} 