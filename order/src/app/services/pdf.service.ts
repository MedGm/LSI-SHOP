import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Commande } from '../models/commande.model';
import { LigneCmd } from '../models/ligneCmd.model';
import { Client } from '../models/client.model';
import { CommandeService } from './commande.service';
import { Observable, from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor(private commandeService: CommandeService) {}

  private calculateTotal(lignesCmds: LigneCmd[]): number {
    return lignesCmds.reduce((total, ligne) => {
      const produit = typeof ligne.produit === 'object' && ligne.produit !== null
        ? ligne.produit
        : { pu: 0 };
      return total + (produit.pu * ligne.qte);
    }, 0);
  }

  generateOrderInvoice(
    commande: Commande,
    lignesCmds: LigneCmd[],
    client: Client
  ): void {
    const doc = new jsPDF();
    const totalAmount = this.calculateTotal(lignesCmds);

    // Add header
    doc.setFontSize(20);
    doc.text('Invoice', 14, 22);

    doc.setFontSize(12);
    doc.text(`Invoice Number: INV-${commande._id?.substring(0, 8).toUpperCase()}`, 14, 32);
    doc.text(`Date: ${new Date(commande.date || new Date()).toLocaleDateString()}`, 14, 38);
    doc.text(`Status: ${commande.status || 'pending'}`, 14, 44);

    // Client information
    doc.setFontSize(14);
    doc.text('Bill To:', 14, 55);
    doc.setFontSize(12);
    doc.text(`${client.nom}`, 14, 61);
    doc.text(`Email: ${client.email}`, 14, 67);

    // Order items
    const tableColumn = ["Product", "Quantity", "Unit Price", "Total"];
    const tableRows: any[][] = [];

    lignesCmds.forEach(ligne => {
      const produit = typeof ligne.produit === 'object' && ligne.produit !== null
        ? ligne.produit
        : { libelle: 'Unknown', pu: 0 };
      const productTotal = produit.pu * ligne.qte;
      tableRows.push([
        produit.libelle,
        ligne.qte,
        `MAD${produit.pu.toFixed(2)}`,
        `MAD${productTotal.toFixed(2)}`
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 75,
      theme: 'striped',
      styles: {
        fontSize: 10
      }
    });

    // Add total amount
    const finalY = (doc as any).lastAutoTable.finalY || 75;
    doc.text(`Total Amount: MAD${totalAmount.toFixed(2)}`, 140, finalY + 10);

    // Add footer
    doc.setFontSize(10);
    doc.text('Thank you for your business!', 14, finalY + 20);
    doc.text('Terms & Conditions:', 14, finalY + 25);
    doc.text('Payment is due within 15 days of invoice date.', 14, finalY + 30);

    // Save the PDF
    doc.save(`invoice-${commande._id}.pdf`);
  }

  generateOrderPdf(
    order: Commande,
    orderLines: LigneCmd[],
    subtotalHT: number,
    tvaAmount: number,
    totalTTC: number
  ): void {
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Add colored header bar
    doc.setFillColor(41, 128, 185); // Bootstrap primary blue
    doc.rect(0, 0, pageWidth, 30, 'F');

    // Header text
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('ORDER INVOICE', pageWidth / 2, 15, { align: 'center' });

    // Shop information
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text('LSI Shop', 14, 40);
    doc.setFontSize(10);
    doc.text('Mohamed El Gorrim', 14, 46);
    doc.text('Software and Intelligent Systems Engineering Student - First Year', 14, 52);
    doc.text('contact@lsishop.com | +212 600 000 000', 14, 58);

    // Add divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 62, pageWidth - 14, 62);

    // Order information with modern styling
    doc.setFontSize(11);
    doc.setTextColor(41, 128, 185);
    doc.text('INVOICE DETAILS', 14, 70);

    doc.setTextColor(80, 80, 80);
    const invoiceNumber = order._id ?
      `INV-${order._id.substring(0, 8).toUpperCase()}` : 'DRAFT';
    doc.text(`Invoice #:`, 14, 78);
    doc.setFont('helvetica', 'bold');
    doc.text(invoiceNumber, 50, 78);
    doc.setFont('helvetica', 'normal');

    const orderDate = order.date ? new Date(order.date) : new Date();
    const formattedDate = orderDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Date:`, 14, 85);
    doc.setFont('helvetica', 'bold');
    doc.text(formattedDate, 50, 85);
    doc.setFont('helvetica', 'normal');

    // Client information
    doc.setTextColor(41, 128, 185);
    doc.text('CLIENT INFORMATION', pageWidth - 90, 70);
    doc.setTextColor(80, 80, 80);

    let clientInfo: Client;
    if (typeof order.client === 'object' && order.client !== null) {
      clientInfo = order.client;
    } else {
      clientInfo = {
        nom: 'Client information not available',
        email: '',
        age: 0
      };
    }

    doc.text(`Name:`, pageWidth - 90, 78);
    doc.setFont('helvetica', 'bold');
    doc.text(clientInfo.nom, pageWidth - 65, 78);
    doc.setFont('helvetica', 'normal');

    if (clientInfo.email) {
      doc.text(`Email:`, pageWidth - 90, 85);
      doc.text(clientInfo.email, pageWidth - 65, 85);
    }

    doc.text(`Age:`, pageWidth - 90, 92);
    doc.text(clientInfo.age?.toString() || 'N/A', pageWidth - 65, 92);

    // Add another divider
    doc.line(14, 100, pageWidth - 14, 100);

    // Add items table with improved styling
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text('ORDER ITEMS', 14, 110);

    // Create table data
    const tableColumn = ["Product", "Unit Price", "Quantity", "Total"];
    const tableRows: any[] = [];

    orderLines.forEach(line => {
      const produit = typeof line.produit === 'object' ? line.produit : { libelle: 'Unknown', pu: 0 };
      tableRows.push([
        produit.libelle,
        `MAD ${produit.pu.toFixed(2)}`,
        line.qte,
        `MAD ${(produit.pu * line.qte).toFixed(2)}`
      ]);
    });

    // Use autoTable with enhanced styling
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 115,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { halign: 'right' },
        2: { halign: 'center' },
        3: { halign: 'right' }
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });

    // Get the Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY || 120;

    // Add totals with better formatting
    doc.setDrawColor(200, 200, 200);
    doc.line(pageWidth - 100, finalY + 10, pageWidth - 14, finalY + 10);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Subtotal:`, pageWidth - 75, finalY + 18);
    doc.text(`MAD ${subtotalHT.toFixed(2)}`, pageWidth - 14, finalY + 18, { align: 'right' });

    doc.text(`TVA (20%):`, pageWidth - 75, finalY + 26);
    doc.text(`MAD ${tvaAmount.toFixed(2)}`, pageWidth - 14, finalY + 26, { align: 'right' });

    doc.line(pageWidth - 100, finalY + 30, pageWidth - 14, finalY + 30);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text(`TOTAL:`, pageWidth - 75, finalY + 38);
    doc.text(`MAD ${totalTTC.toFixed(2)}`, pageWidth - 14, finalY + 38, { align: 'right' });

    // Add thank you note
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text('Thank you for your business!', pageWidth / 2, finalY + 50, { align: 'center' });

    // Add terms and conditions
    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text('Terms & Conditions: Payment is due within 15 days. Please include the invoice number with your payment.',
      pageWidth / 2, finalY + 58, { align: 'center' });

    // Add footer with shop contact
    doc.setFillColor(240, 240, 240);
    doc.rect(0, doc.internal.pageSize.height - 15, pageWidth, 15, 'F');

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('© 2025 ElGorrim Shop - All Rights Reserved', pageWidth / 2, doc.internal.pageSize.height - 8,
      { align: 'center' });

    // Save the PDF
    doc.save(`Order_${order._id || 'Draft'}.pdf`);
  }

  generateEnhancedOrderPdf(
    order: Commande,
    orderLines: LigneCmd[],
    client: Client
  ): void {
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Calculate financial values
    const subtotalHT = this.calculateTotal(orderLines);
    const tvaRate = 0.20; // 20% VAT
    const tvaAmount = subtotalHT * tvaRate;
    const totalTTC = subtotalHT + tvaAmount;

    // Add colored header bar
    doc.setFillColor(41, 128, 185); // Bootstrap primary blue
    doc.rect(0, 0, pageWidth, 35, 'F');

    // Header text
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('ORDER INVOICE', pageWidth / 2, 20, { align: 'center' });

    // Shop information
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text('ElGorrim Shop', 14, 45);
    doc.setFontSize(10);
    doc.text('Mohamed El Gorrim', 14, 51);
    doc.text('Software and Intelligent Systems Engineering Student', 14, 57);
    doc.text('contact@elgorrimshop.com | +212 600 000 000', 14, 63);

    // Add logo placeholder (this could be replaced with an actual logo)
    doc.setFillColor(220, 220, 220);
    doc.roundedRect(pageWidth - 60, 40, 45, 25, 3, 3, 'F');
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('LOGO', pageWidth - 37.5, 53, { align: 'center' });

    // Add divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 70, pageWidth - 14, 70);

    // Order information with modern styling
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text('INVOICE DETAILS', 14, 80);

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);

    const invoiceNumber = order._id ?
      `INV-${order._id.substring(0, 8).toUpperCase()}` : 'DRAFT';
    doc.text(`Invoice #:`, 14, 90);
    doc.setFont('helvetica', 'bold');
    doc.text(invoiceNumber, 50, 90);
    doc.setFont('helvetica', 'normal');

    const orderDate = order.date ? new Date(order.date) : new Date();
    const formattedDate = orderDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Date:`, 14, 97);
    doc.setFont('helvetica', 'bold');
    doc.text(formattedDate, 50, 97);
    doc.setFont('helvetica', 'normal');

    doc.text(`Status:`, 14, 104);
    doc.setFont('helvetica', 'bold');
    doc.text(order.status || 'Pending', 50, 104);
    doc.setFont('helvetica', 'normal');

    // Client information
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(12);
    doc.text('CLIENT INFORMATION', pageWidth - 90, 80);
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);

    doc.text(`Name:`, pageWidth - 90, 90);
    doc.setFont('helvetica', 'bold');
    doc.text(client.nom, pageWidth - 65, 90);
    doc.setFont('helvetica', 'normal');

    if (client.email) {
      doc.text(`Email:`, pageWidth - 90, 97);
      doc.text(client.email, pageWidth - 65, 97);
    }

    doc.text(`Age:`, pageWidth - 90, 104);
    doc.text(client.age?.toString() || 'N/A', pageWidth - 65, 104);

    // Add another divider
    doc.line(14, 112, pageWidth - 14, 112);

    // Add items table with improved styling
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text('ORDER ITEMS', 14, 122);

    // Create table data
    const tableColumn = ["Product", "Unit Price", "Quantity", "Total"];
    const tableRows: any[] = [];

    orderLines.forEach(line => {
      const produit = typeof line.produit === 'object' ? line.produit : { libelle: 'Unknown', pu: 0 };
      tableRows.push([
        produit.libelle,
        `MAD ${produit.pu.toFixed(2)}`,
        line.qte,
        `MAD ${(produit.pu * line.qte).toFixed(2)}`
      ]);
    });

    // Use autoTable with enhanced styling
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 127,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { halign: 'right' },
        2: { halign: 'center' },
        3: { halign: 'right' }
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });

    // Get the Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY || 130;

    // Add totals with better formatting
    doc.setDrawColor(200, 200, 200);
    doc.line(pageWidth - 100, finalY + 10, pageWidth - 14, finalY + 10);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Subtotal:`, pageWidth - 75, finalY + 18);
    doc.text(`MAD ${subtotalHT.toFixed(2)}`, pageWidth - 14, finalY + 18, { align: 'right' });

    doc.text(`TVA (20%):`, pageWidth - 75, finalY + 26);
    doc.text(`MAD ${tvaAmount.toFixed(2)}`, pageWidth - 14, finalY + 26, { align: 'right' });

    doc.line(pageWidth - 100, finalY + 30, pageWidth - 14, finalY + 30);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text(`TOTAL:`, pageWidth - 75, finalY + 38);
    doc.text(`MAD ${totalTTC.toFixed(2)}`, pageWidth - 14, finalY + 38, { align: 'right' });

    // Add thank you note
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text('Thank you for your business!', pageWidth / 2, finalY + 50, { align: 'center' });

    // Add payment information
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text('Payment Information:', 14, finalY + 65);
    doc.setFontSize(9);
    doc.text('Bank: Example Bank', 14, finalY + 72);
    doc.text('Account: 123-456-789', 14, finalY + 78);
    doc.text('Please include the invoice number with your payment', 14, finalY + 84);

    // Add terms and conditions
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text('Terms & Conditions:', pageWidth - 90, finalY + 65);
    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text('1. Payment is due within 15 days.', pageWidth - 90, finalY + 72);
    doc.text('2. Products cannot be returned after 30 days.', pageWidth - 90, finalY + 78);
    doc.text('3. Shipping costs are non-refundable.', pageWidth - 90, finalY + 84);

    // Add footer with shop contact
    doc.setFillColor(240, 240, 240);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('© 2025 ElGorrim Shop - All Rights Reserved', pageWidth / 2, pageHeight - 8,
      { align: 'center' });

    // Save the PDF
    doc.save(`Order_${order._id || 'Draft'}.pdf`);
  }

  /**
   * Saves an order and generates a PDF in one operation
   */
  saveOrderAndGeneratePdf(
    order: Commande,
    orderLines: LigneCmd[],
    client: Client
  ): Observable<string> {
    // First save the order, then generate PDF
    return this.commandeService.createCommande({
      client: typeof order.client === 'string' ? order.client : (order.client._id || ''),
      date: order.date,
      lignes: orderLines.map(line => ({
        produit: typeof line.produit === 'string' ? line.produit : line.produit._id || '',
        qte: line.qte
      }))
    }).pipe(
      switchMap(response => {
        // Extract the commande object from the response
        const savedOrder = response.commande;
        const savedLines = response.lignes || orderLines;
        // After order is saved, generate and return the PDF
        this.generateEnhancedOrderPdf(savedOrder, savedLines, client);
        return from(['Order saved and PDF generated successfully']);
      })
    );
  }
}
