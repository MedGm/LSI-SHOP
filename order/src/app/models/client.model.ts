export interface Client {
  _id?: string;
  nom: string;
  email: string;
  age: number;
  createdAt?: Date;
  updatedAt?: Date;
}