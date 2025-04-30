export interface User {
  _id?: string;
  email: string;
  password?: string;
  name?: string;
  token?: string;
  role?: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}