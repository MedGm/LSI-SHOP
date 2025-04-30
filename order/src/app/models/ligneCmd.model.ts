import { Commande } from './commande.model';
import { Produit } from './produit.model';

export interface LigneCmd {
  _id?: string;
  commande: Commande | string; // Can be string (ID) or Commande object when populated
  produit: Produit | string; // Can be string (ID) or Produit object when populated
  qte: number;
  createdAt?: Date;
  updatedAt?: Date;
}