import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Client } from '../../models/client.model';
import { Produit } from '../../models/produit.model';
import { Commande } from '../../models/commande.model';
import { LigneCmd } from '../../models/ligneCmd.model';
import { ClientService } from '../../services/client.service';
import { ProduitService } from '../../services/produit.service';
import { CommandeService } from '../../services/commande.service';
import { PdfService } from '../../services/pdf.service';
import { AuthService } from '../../services/auth.service';

interface OrderLine {
  produitId: string;
  qte: number;
  produit?: Produit;
  total?: number;
}

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule],
  template: `
    <div class="container-fluid">
      <!-- Header with logout button -->
      <div class="d-flex justify-content-between align-items-center bg-primary text-white p-3 mb-4">
        <h1 class="m-0">Order Management System</h1>
        <button
          (click)="logout()"
          class="btn btn-outline-light"
        >
          <i class="bi bi-box-arrow-right me-1"></i> Logout
        </button>
      </div>

      <!-- Alert messages -->
      <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ errorMessage }}
        <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
      </div>

      <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
        {{ successMessage }}
        <button type="button" class="btn-close" (click)="successMessage = ''"></button>
      </div>

      <!-- Main content -->
      <div class="row">
        <div class="col-12">
          <!-- Header Section with client select and date picker -->
          <div class="card mb-4">
            <div class="card-header bg-light">
              <h5 class="mb-0">Order Information</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <!-- Client selection dropdown - Left side -->
                <div class="col-md-6 mb-3">
                  <div class="d-flex justify-content-between align-items-end mb-2">
                    <label for="clientSelect" class="form-label mb-0">Client</label>
                    <!-- New button to create client -->
                    <button
                      *ngIf="!isViewMode"
                      (click)="openCreateClientModal(createClientModal)"
                      class="btn btn-sm btn-primary"
                      title="Create New Client"
                    >
                      <i class="bi bi-plus-circle me-1"></i> New Client
                    </button>
                  </div>
                  <select
                    id="clientSelect"
                    [(ngModel)]="selectedClientId"
                    (change)="onClientSelect()"
                    class="form-select"
                    [disabled]="isViewMode"
                  >
                    <option value="" disabled selected>-- Select Client --</option>
                    <option *ngFor="let client of clients" [value]="client._id">
                      {{ client.nom }}
                    </option>
                  </select>

                  <!-- Display client details if selected -->
                  <div *ngIf="selectedClient" class="mt-2 text-secondary small">
                    <p class="mb-0"><strong>Email:</strong> {{ selectedClient.email }}</p>
                    <p class="mb-0"><strong>Age:</strong> {{ selectedClient.age }}</p>
                  </div>
                </div>

                <!-- Date picker - Right side -->
                <div class="col-md-6 mb-3">
                  <label for="orderDate" class="form-label">Order Date</label>
                  <div class="d-flex">
                    <input
                      type="date"
                      id="orderDate"
                      [(ngModel)]="orderDate"
                      (change)="onDateChange()"
                      class="form-control"
                      [max]="today"
                      [readonly]="isViewMode"
                    >
                    <button
                      *ngIf="!isViewMode && !isCurrentDate()"
                      (click)="resetToToday()"
                      class="btn btn-outline-secondary ms-2"
                      title="Reset to today"
                    >
                      Today
                    </button>
                  </div>

                  <!-- Show warning if viewing past orders -->
                  <div *ngIf="isViewMode" class="mt-2 text-warning small">
                    <p class="mb-0">
                      <i class="bi bi-exclamation-triangle me-1"></i>
                      Viewing past orders. You cannot modify these orders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items Table -->
          <div class="card mb-4">
            <div class="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Order Items</h5>
              <div>
                <!-- New button to create product -->
                <button
                  *ngIf="!isViewMode"
                  (click)="openCreateProductModal(createProductModal)"
                  class="btn btn-sm btn-primary me-2"
                  title="Create New Product"
                >
                  <i class="bi bi-plus-circle me-1"></i> New Product
                </button>
                <button
                  *ngIf="!isViewMode"
                  (click)="addOrderLine()"
                  class="btn btn-sm btn-primary"
                >
                  <i class="bi bi-plus"></i> Add Item
                </button>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-striped table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th class="text-center" style="width: 150px;">Quantity</th>
                      <th class="text-end" style="width: 150px;">Unit Price</th>
                      <th class="text-end" style="width: 150px;">Total</th>
                      <th class="text-center" style="width: 100px;">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngIf="orderLines.length === 0">
                      <td colspan="5" class="text-center py-3 text-muted">
                        No items added to this order yet.
                        <span *ngIf="!isViewMode">Click "Add Item" to start.</span>
                      </td>
                    </tr>

                    <tr *ngFor="let line of orderLines; let i = index">
                      <!-- Product selection -->
                      <td>
                        <select
                          [(ngModel)]="line.produitId"
                          (change)="updateOrderLine(i)"
                          class="form-select"
                          [disabled]="isViewMode"
                        >
                          <option value="" disabled selected>-- Select Product --</option>
                          <option *ngFor="let produit of produits" [value]="produit._id">
                            {{ produit.libelle }}
                          </option>
                        </select>
                      </td>

                      <!-- Quantity with +/- buttons -->
                      <td>
                        <div class="input-group">
                          <button
                            class="btn btn-outline-secondary"
                            type="button"
                            (click)="decrementQuantity(i)"
                            [disabled]="isViewMode || line.qte <= 1"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            class="form-control text-center"
                            [(ngModel)]="line.qte"
                            (change)="updateOrderLine(i)"
                            min="1"
                            [readonly]="isViewMode"
                          >
                          <button
                            class="btn btn-outline-secondary"
                            type="button"
                            (click)="incrementQuantity(i)"
                            [disabled]="isViewMode"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <!-- Unit price (read-only) -->
                      <td class="text-end">
                        {{ getProductPrice(line.produitId) | currency:'MAD ':'symbol':'1.2-2' }}
                      </td>

                      <!-- Line total (calculated) -->
                      <td class="text-end">
                        {{ getLineTotal(line) | currency:'MAD ':'symbol':'1.2-2' }}
                      </td>

                      <!-- Actions -->
                      <td class="text-center">
                        <button
                          *ngIf="!isViewMode"
                          type="button"
                          class="btn btn-sm btn-danger"
                          (click)="removeOrderLine(i)"
                          title="Remove item"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Order summary and actions -->
          <div class="row">
            <!-- Order totals - right aligned -->
            <div class="col-md-6 offset-md-6">
              <div class="card mb-4">
                <div class="card-header bg-light">
                  <h5 class="mb-0">Order Summary</h5>
                </div>
                <div class="card-body">
                  <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal (HT):</span>
                    <span>{{ subtotalHT | currency:'MAD ':'symbol':'1.2-2' }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>TVA (20%):</span>
                    <span>{{ tvaAmount | currency:'MAD ':'symbol':'1.2-2' }}</span>
                  </div>
                  <div class="d-flex justify-content-between fw-bold">
                    <span>Total (TTC):</span>
                    <span>{{ totalTTC | currency:'MAD ':'symbol':'1.2-2' }}</span>
                  </div>
                </div>
                <div class="card-footer bg-white d-flex justify-content-end gap-2">
                  <!-- Action buttons with merged functionality -->
                  <div *ngIf="!isViewMode" class="dropdown" ngbDropdown>
                    <button
                      class="btn btn-success dropdown-toggle"
                      type="button"
                      ngbDropdownToggle
                      [disabled]="!canSaveOrder || isLoading"
                    >
                      <i class="bi bi-save me-1"></i>
                      {{ isLoading ? 'Saving...' : 'Save Order' }}
                    </button>
                    <div class="dropdown-menu" ngbDropdownMenu>
                      <button ngbDropdownItem (click)="saveOrder()">Save Only</button>
                      <button ngbDropdownItem (click)="saveOrder(true)" [disabled]="!canSaveOrder || isLoading">Save & Export PDF</button>
                    </div>
                  </div>

                  <button
                    *ngIf="isViewMode"
                    type="button"
                    class="btn btn-primary"
                    (click)="exportPdf()"
                    [disabled]="!canExportPdf || isLoading"
                  >
                    <i class="bi bi-file-pdf me-1"></i>
                    Export PDF
                  </button>

                  <button
                    *ngIf="isViewMode"
                    type="button"
                    class="btn btn-secondary"
                    (click)="resetToToday()"
                  >
                    <i class="bi bi-plus-circle me-1"></i>
                    New Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Client Modal Template -->
    <ng-template #createClientModal let-modal>
      <div class="modal-header">
        <h5 class="modal-title">Create New Client</h5>
        <button type="button" class="btn-close" (click)="modal.dismiss()"></button>
      </div>
      <div class="modal-body">
        <form>
          <div class="mb-3">
            <label for="clientName" class="form-label">Nom</label>
            <input type="text" class="form-control" id="clientName" [(ngModel)]="newClient.nom" name="nom" required>
          </div>
          <div class="mb-3">
            <label for="clientEmail" class="form-label">Email</label>
            <input type="email" class="form-control" id="clientEmail" [(ngModel)]="newClient.email" name="email" required>
          </div>
          <div class="mb-3">
            <label for="clientAge" class="form-label">Age</label>
            <input type="number" class="form-control" id="clientAge" [(ngModel)]="newClient.age" name="age" required min="1" max="120">
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="modal.dismiss()">Cancel</button>
        <button type="button" class="btn btn-primary" (click)="createClient(); modal.close()">Create</button>
      </div>
    </ng-template>

    <!-- Create Product Modal Template -->
    <ng-template #createProductModal let-modal>
      <div class="modal-header">
        <h5 class="modal-title">Create New Product</h5>
        <button type="button" class="btn-close" (click)="modal.dismiss()"></button>
      </div>
      <div class="modal-body">
        <form>
          <div class="mb-3">
            <label for="productName" class="form-label">Libellé</label>
            <input type="text" class="form-control" id="productName" [(ngModel)]="newProduct.libelle" name="libelle" required>
          </div>
          <div class="mb-3">
            <label for="productPrice" class="form-label">Prix unitaire</label>
            <div class="input-group">
              <span class="input-group-text">MAD</span>
              <input type="number" class="form-control" id="productPrice" [(ngModel)]="newProduct.pu" name="pu" required min="0" step="0.01">
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="modal.dismiss()">Cancel</button>
        <button type="button" class="btn btn-primary" (click)="createProduct(); modal.close()">Create</button>
      </div>
    </ng-template>
  `,
  styles: [`
    .bi-trash {
      display: inline-block;
      width: 1em;
      height: 1em;
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg>');
      background-repeat: no-repeat;
      background-position: center;
    }

    .bi-plus {
      display: inline-block;
      width: 1em;
      height: 1em;
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg>');
      background-repeat: no-repeat;
      background-position: center;
    }

    .bi-exclamation-triangle {
      display: inline-block;
      width: 1em;
      height: 1em;
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/><path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/></svg>');
      background-repeat: no-repeat;
      background-position: center;
    }

    .bi-box-arrow-right {
      display: inline-block;
      width: 1em;
      height: 1em;
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M6.5 3.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-9zM7 4v8h4V4H7z"/><path fill-rule="evenodd" d="M4.146 8.354a.5.5 0 0 1 .708 0L6 9.5l-1.146 1.146a.5.5 0 0 1-.708-.708L5.293 9.5 4.146 8.354a.5.5 0 0 1 0-.708z"/><path fill-rule="evenodd" d="M1.5 8a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5z"/></svg>');
      background-repeat: no-repeat;
      background-position: center;
    }

    .bi-save {
      display: inline-block;
      width: 1em;
      height: 1em;
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-save" viewBox="0 0 16 16"><path d="M7.5 1h-5A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 13.5 1h-5a.5.5 0 0 0-.5.5v1h-1v-1a.5.5 0 0 0-.5-.5zM2.5 2h5v1h-5V2zm11 0h-5v1h5V2zM2 3v10h12V3H2zm1 1h10v8H3V4z"/></svg>');
      background-repeat: no-repeat;
      background-position: center;
    }

    .bi-file-pdf {
      display: inline-block;
      width: 1em;
      height: 1em;
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-pdf" viewBox="0 0 16 16"><path d="M4.5 0A1.5 1.5 0 0 0 3 1.5v13A1.5 1.5 0 0 0 4.5 16h7a1.5 1.5 0 0 0 1.5-1.5V4.5L9.5 0h-5zM4 1.5A.5.5 0 0 1 4.5 1h4.793L12 3.707V14.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-13z"/><path d="M4.5 0A1.5 1.5 0 0 0 3 1.5v13A1.5 1.5 0 0 0 4.5 16h7a1.5 1.5 0 0 0 1.5-1.5V4.5L9.5 0h-5zM4 1.5A.5.5 0 0 1 4.5 1h4.793L12 3.707V14.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-13z"/></svg>');
      background-repeat: no-repeat;
      background-position: center;
    }

    .bi-plus-circle {
      display: inline-block;
      width: 1em;
      height: 1em;
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"/></svg>');
      background-repeat: no-repeat;
      background-position: center;
    }
  `]
})
export class OrderComponent implements OnInit {
  // Data models
  clients: Client[] = [];
  produits: Produit[] = [];
  orderLines: OrderLine[] = [];

  // Selected data
  selectedClientId: string = '';
  selectedClient: Client | null = null;
  orderDate: string = new Date().toISOString().split('T')[0]; // Today in YYYY-MM-DD format
  today: string = new Date().toISOString().split('T')[0]; // Today's date for max date picker

  // New client and product forms
  newClient: Client = { nom: '', email: '', age: 0 };
  newProduct: Produit = { libelle: '', pu: 0 };

  // Calculated totals
  subtotalHT: number = 0;
  tvaAmount: number = 0;
  totalTTC: number = 0;

  // UI state
  isLoading: boolean = false;
  isViewMode: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Historical orders when in view mode
  pastOrders: Commande[] = [];
  selectedOrderId: string = '';

  constructor(
    private clientService: ClientService,
    private produitService: ProduitService,
    private commandeService: CommandeService,
    private pdfService: PdfService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // Load clients and products
    this.loadClients();
    this.loadProduits();

    // Start with one empty order line
    this.addOrderLine();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load clients. Please try again.';
        console.error('Error loading clients:', error);
      }
    });
  }

  loadProduits(): void {
    this.produitService.getProduits().subscribe({
      next: (produits) => {
        this.produits = produits;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load products. Please try again.';
        console.error('Error loading products:', error);
      }
    });
  }

  // New methods for client and product creation
  openCreateClientModal(content?: any): void {
    // Reset the form
    this.newClient = { nom: '', email: '', age: 0 };

    // Open the modal
    this.modalService.open(content || document.getElementById('createClientModal'));
  }

  openCreateProductModal(content?: any): void {
    // Reset the form
    this.newProduct = { libelle: '', pu: 0 };

    // Open the modal
    this.modalService.open(content || document.getElementById('createProductModal'));
  }

  createClient(): void {
    if (!this.newClient.nom || !this.newClient.email) {
      this.errorMessage = 'Please fill all required client fields';
      return;
    }

    this.isLoading = true;
    this.clientService.createClient(this.newClient).subscribe({
      next: (client) => {
        this.isLoading = false;
        this.successMessage = `Client "${client.nom}" created successfully!`;

        // Add to clients list and select the new client
        this.clients.push(client);
        this.selectedClientId = client._id!;
        this.selectedClient = client;

        // Reset the form
        this.newClient = { nom: '', email: '', age: 0 };
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to create client. Please try again.';
        console.error('Error creating client:', error);
      }
    });
  }

  createProduct(): void {
    if (!this.newProduct.libelle || this.newProduct.pu <= 0) {
      this.errorMessage = 'Please fill all required product fields with valid values';
      return;
    }

    this.isLoading = true;
    this.produitService.createProduit(this.newProduct).subscribe({
      next: (product) => {
        this.isLoading = false;
        this.successMessage = `Product "${product.libelle}" created successfully!`;

        // Add to products list
        this.produits.push(product);

        // Reset the form
        this.newProduct = { libelle: '', pu: 0 };
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to create product. Please try again.';
        console.error('Error creating product:', error);
      }
    });
  }

  onClientSelect(): void {
    this.selectedClient = this.clients.find(client => client._id === this.selectedClientId) || null;
  }

  onDateChange(): void {
    const selectedDate = new Date(this.orderDate);
    const today = new Date(this.today);

    // If selected date is today, we're in create mode
    if (selectedDate.toISOString().split('T')[0] === today.toISOString().split('T')[0]) {
      this.isViewMode = false;
      this.resetOrderForm();
      return;
    }

    // If selected date is in the past, load past orders for that date
    this.isViewMode = true;
    this.loadOrdersByDate(selectedDate);
  }

  loadOrdersByDate(date: Date): void {
    this.isLoading = true;
    this.commandeService.getCommandesByDate(date).subscribe({
      next: (orders) => {
        this.pastOrders = orders;
        this.isLoading = false;

        if (orders.length === 0) {
          this.errorMessage = 'No orders found for the selected date.';
          return;
        }

        // Load the first order by default
        if (orders.length > 0 && orders[0]._id) {
          this.selectedOrderId = orders[0]._id;
          this.loadOrderDetails(this.selectedOrderId);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load orders for the selected date.';
        console.error('Error loading orders by date:', error);
      }
    });
  }

  loadOrderDetails(orderId: string): void {
    this.isLoading = true;
    this.commandeService.getCommandeById(orderId).subscribe({
      next: (orderDetails) => {
        this.isLoading = false;

        // Set client
        if (typeof orderDetails.client === 'object') {
          this.selectedClientId = orderDetails.client._id || '';
          this.selectedClient = orderDetails.client;
        } else {
          this.selectedClientId = orderDetails.client as string;
          this.onClientSelect();
        }

        // Clear existing order lines
        this.orderLines = [];

        // Add order lines
        if (orderDetails.lignes && orderDetails.lignes.length > 0) {
          orderDetails.lignes.forEach(ligne => {
            const produitId = typeof ligne.produit === 'object' ? ligne.produit._id : ligne.produit as string;
            this.orderLines.push({
              produitId: produitId || '',
              qte: ligne.qte,
              produit: typeof ligne.produit === 'object' ? ligne.produit : undefined
            });
          });
        }

        // Calculate totals
        this.calculateTotals();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load order details.';
        console.error('Error loading order details:', error);
      }
    });
  }

  resetToToday(): void {
    this.orderDate = this.today;
    this.isViewMode = false;
    this.resetOrderForm();
  }

  resetOrderForm(): void {
    this.selectedClientId = '';
    this.selectedClient = null;
    this.orderLines = [];
    this.addOrderLine();
    this.calculateTotals();
    this.errorMessage = '';
    this.successMessage = '';
  }

  isCurrentDate(): boolean {
    return this.orderDate === this.today;
  }

  addOrderLine(): void {
    this.orderLines.push({ produitId: '', qte: 1 });
  }

  removeOrderLine(index: number): void {
    this.orderLines.splice(index, 1);

    // If all lines are removed, add an empty one
    if (this.orderLines.length === 0) {
      this.addOrderLine();
    }

    this.calculateTotals();
  }

  incrementQuantity(index: number): void {
    this.orderLines[index].qte++;
    this.updateOrderLine(index);
  }

  decrementQuantity(index: number): void {
    if (this.orderLines[index].qte > 1) {
      this.orderLines[index].qte--;
      this.updateOrderLine(index);
    }
  }

  updateOrderLine(index: number): void {
    // Ensure quantity is at least 1
    if (this.orderLines[index].qte < 1) {
      this.orderLines[index].qte = 1;
    }

    // Find product details from produitId
    const produit = this.produits.find(p => p._id === this.orderLines[index].produitId);
    if (produit) {
      this.orderLines[index].produit = produit;
    }

    this.calculateTotals();
  }

  getProductPrice(produitId: string): number {
    const produit = this.produits.find(p => p._id === produitId);
    return produit ? produit.pu : 0;
  }

  getLineTotal(line: OrderLine): number {
    return line.produitId ? this.getProductPrice(line.produitId) * line.qte : 0;
  }

  calculateTotals(): void {
    // Calculate subtotal (HT)
    this.subtotalHT = this.orderLines.reduce((total, line) => {
      return total + this.getLineTotal(line);
    }, 0);

    // Calculate TVA (20%)
    this.tvaAmount = this.subtotalHT * 0.2;

    // Calculate total TTC
    this.totalTTC = this.subtotalHT + this.tvaAmount;
  }

  get canSaveOrder(): boolean {
    return (
      !!this.selectedClientId &&
      this.orderLines.length > 0 &&
      this.orderLines.every(line => !!line.produitId && line.qte > 0) &&
      this.subtotalHT > 0
    );
  }

  get canExportPdf(): boolean {
    if (this.isViewMode) {
      // In view mode, we can always export if there are order lines
      return this.orderLines.length > 0 && this.orderLines.every(line => !!line.produitId);
    }

    // In create mode, we need all the order data to be valid
    return this.canSaveOrder;
  }

  saveOrder(exportPdf: boolean = false): void {
    if (!this.canSaveOrder) {
      this.errorMessage = 'Please fill in all required fields before saving.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Prepare the order data
    const orderData = {
      client: this.selectedClientId,
      date: new Date(this.orderDate),
      lignes: this.orderLines.map(line => ({
        produit: line.produitId,
        qte: line.qte
      }))
    };

    // Create the order
    this.commandeService.createCommande(orderData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Order saved successfully!';

        if (exportPdf) {
          this.exportPdf();
        }

        // Reset the form after a short delay
        setTimeout(() => {
          this.resetOrderForm();
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to save order. Please try again.';
        console.error('Error saving order:', error);
      }
    });
  }

  exportPdf(): void {
    if (!this.canExportPdf) {
      this.errorMessage = 'Cannot generate PDF with incomplete order data.';
      return;
    }

    // Create a mock order object for PDF generation
    const mockOrder: Commande = {
      _id: this.isViewMode ? this.selectedOrderId : 'DRAFT',
      client: this.selectedClient!,
      date: new Date(this.orderDate)
    };

    // Create order lines for PDF
    const orderLinesForPdf: LigneCmd[] = this.orderLines.map(line => {
      const produit = this.produits.find(p => p._id === line.produitId)!;
      return {
        _id: `TEMP-${Math.random().toString(36).substring(2, 9)}`,
        commande: mockOrder,
        produit: produit,
        qte: line.qte,
        total: this.getLineTotal(line)
      };
    });

    // Generate the PDF
    this.pdfService.generateOrderPdf(
      mockOrder,
      orderLinesForPdf,
      this.subtotalHT,
      this.tvaAmount,
      this.totalTTC
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
