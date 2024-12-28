
export type Id = string | number;
export interface HasId<I extends Id> {
  id: I;
}
export type PartialId<I extends Id, T extends HasId<I>> =Omit<T, 'id'> & Partial<HasId<I>>;
export interface CRUDRepository<I extends Id = string, T extends HasId<I> = HasId<I>> {
  create(data: PartialId<I, T>): Promise<T>;
  read(id: I): Promise<T | null>;
  update(id: I, data: Partial<T>): Promise<void>;
  delete(id: I): Promise<void>;
  findAllBy(field: keyof T, operator: WhereOperator, value: T[keyof T]): Promise<T[]>;
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