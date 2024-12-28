import { DocumentData } from 'firebase/firestore';

export interface Database {
  collection<T extends DocumentData>(name: string): Collection<T>;
  doc<T extends DocumentData>(collectionName: string, id: string): Document<T>;
}

export interface Collection<T extends DocumentData> {
  doc(id: string): Document<T>;
  newDoc(): Document<T>;
  where(field: keyof T, operator: WhereOperator, value: T[keyof T]): Query<T>;
}

export interface Document<T extends DocumentData> {
  id: string;
  exists(): Promise<boolean>;
  data(): Promise<T>;
  set(data: T): Promise<void>;
  update(data: Partial<T>): Promise<void>;
  delete(): Promise<void>;
}

export interface Query<T extends DocumentData> {
  get(): Promise<QuerySnapshot<T>>;
}

export interface QuerySnapshot<T extends DocumentData> {
  docs: QueryDocumentSnapshot<T>[];
}

export interface QueryDocumentSnapshot<T extends DocumentData> {
  id: string;
  exists: boolean;
  data(): T;
}

export type WhereOperator = 
  | "==" 
  | "!=" 
  | "<" 
  | "<=" 
  | ">" 
  | ">=" 
  | "array-contains" 
  | "array-contains-any" 
  | "in" 
  | "not-in"; 