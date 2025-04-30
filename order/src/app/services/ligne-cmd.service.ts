import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LigneCmd } from '../models/ligneCmd.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LigneCmdService {
  private apiUrl = 'http://localhost:3000/api/ligneCmd';
  
  constructor(private http: HttpClient, private authService: AuthService) {}
  
  // Get HTTP headers with authorization token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  
  // Get all order lines
  getLignesCmd(): Observable<LigneCmd[]> {
    return this.http.get<LigneCmd[]>(this.apiUrl, { headers: this.getHeaders() });
  }
  
  // Get order lines by order ID
  getLignesCmdByCommande(commandeId: string): Observable<LigneCmd[]> {
    return this.http.get<LigneCmd[]>(
      `${this.apiUrl}/commande/${commandeId}`, 
      { headers: this.getHeaders() }
    );
  }
  
  // Create new order line
  createLigneCmd(ligneCmd: { commande: string, produit: string, qte: number }): Observable<LigneCmd> {
    return this.http.post<LigneCmd>(
      this.apiUrl,
      ligneCmd,
      { headers: this.getHeaders() }
    );
  }
  
  // Update order line
  updateLigneCmd(id: string, ligneCmd: { qte: number }): Observable<LigneCmd> {
    return this.http.put<LigneCmd>(
      `${this.apiUrl}/${id}`,
      ligneCmd,
      { headers: this.getHeaders() }
    );
  }
  
  // Delete order line
  deleteLigneCmd(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${id}`, 
      { headers: this.getHeaders() }
    );
  }
}