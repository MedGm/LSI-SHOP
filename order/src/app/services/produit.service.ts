import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../models/produit.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://localhost:3000/api/produits';
  
  constructor(private http: HttpClient, private authService: AuthService) {}
  
  // Get HTTP headers with authorization token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  
  // Get all products
  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl, { headers: this.getHeaders() });
  }
  
  // Get product by ID
  getProduitById(id: string): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  
  // Create new product
  createProduit(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, produit, { headers: this.getHeaders() });
  }
  
  // Update product
  updateProduit(id: string, produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/${id}`, produit, { headers: this.getHeaders() });
  }
  
  // Delete product
  deleteProduit(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}