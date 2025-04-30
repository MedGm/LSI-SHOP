import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande } from '../models/commande.model';
import { LigneCmd } from '../models/ligneCmd.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'http://localhost:3000/api/commandes';
  
  constructor(private http: HttpClient, private authService: AuthService) {}
  
  // Get HTTP headers with authorization token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  
  // Get all orders
  getCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.apiUrl, { headers: this.getHeaders() });
  }
  
  // Get order by ID with order lines
  getCommandeById(id: string): Observable<Commande & { lignes: LigneCmd[] }> {
    return this.http.get<Commande & { lignes: LigneCmd[] }>(
      `${this.apiUrl}/${id}`, 
      { headers: this.getHeaders() }
    );
  }
  
  // Get orders by date
  getCommandesByDate(date: Date): Observable<Commande[]> {
    const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    return this.http.get<Commande[]>(
      `${this.apiUrl}?date=${formattedDate}`,
      { headers: this.getHeaders() }
    );
  }
  
  // Create new order with order lines
  createCommande(commande: {
    client: string,
    date: Date,
    lignes: { produit: string, qte: number }[]
  }): Observable<{ commande: Commande, lignes: LigneCmd[] }> {
    return this.http.post<{ commande: Commande, lignes: LigneCmd[] }>(
      this.apiUrl,
      commande,
      { headers: this.getHeaders() }
    );
  }
  
  // Update order
  updateCommande(id: string, commande: { client: string, date: Date }): Observable<Commande> {
    return this.http.put<Commande>(
      `${this.apiUrl}/${id}`,
      commande,
      { headers: this.getHeaders() }
    );
  }
  
  // Delete order
  deleteCommande(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${id}`, 
      { headers: this.getHeaders() }
    );
  }
}