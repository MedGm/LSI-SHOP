import { Client } from './client.model';
import { LigneCmd } from './ligneCmd.model';

export interface Commande {
  _id?: string;
  client: Client | string;
  date: Date;
  status?: 'pending' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
  lignes?: LigneCmd[]; // Adding lignes property to fix the TypeScript error
}