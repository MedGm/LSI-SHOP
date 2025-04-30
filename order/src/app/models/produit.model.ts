export interface Produit {
  _id?: string;
  libelle: string;
  pu: number; // Price per unit
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}