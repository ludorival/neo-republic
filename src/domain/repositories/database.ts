export interface Database {
  collection(name: string): Collection;
  doc(collectionName: string, id: string): Document;
}

export interface Collection {
  doc(id: string): Document;
  newDoc(): Document;
  where(field: string, operator: string, value: any): Query;
}

export interface Document {
  id: string;
  exists(): Promise<boolean>;
  data(): Promise<any>;
  set(data: any): Promise<void>;
  update(data: any): Promise<void>;
  delete(): Promise<void>;
}

export interface Query {
  get(): Promise<QuerySnapshot>;
}

export interface QuerySnapshot {
  docs: QueryDocumentSnapshot[];
}

export interface QueryDocumentSnapshot {
  id: string;
  exists: boolean;
  data(): any;
} 