import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ProductFormComponent } from '../product-form/product-form.component';
import { BasketService } from '../../services/basket.service';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  imports: [
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    CurrencyPipe,
    CommonModule,
    
  ]
})
export class ProductComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    public authService: AuthService,
    private basketService: BasketService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => this.products = products,
      error: () => this.snackBar.open('Nem sikerült betölteni a termékeket.', 'Értem', { duration: 3000 })
    });
  }

  orderOnClick(product: Product) {
    this.basketService.addOrUpdateProduct({
      productId: product._id,
      quantity: 1,
    });
    this.snackBar.open(`A(z) "${product.name}" termék a kosárba került!`, 'Értem', { duration: 2000 });
  }

  addProduct(): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '400px',
      data: {},
      autoFocus: true,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
        this.snackBar.open('Új termék sikeresen hozzáadva!', 'Értem', { duration: 2000 });
      }
    });
  }

  editProduct(product: Product): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '400px',
      data: { product },
      autoFocus: true,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
        this.snackBar.open('A termék sikeresen frissítve!', 'Értem', { duration: 2000 });
      }
    });
  }

  deleteProduct(product: Product): void {
    if (confirm(`Biztosan törölni szeretné a(z) "${product.name}" terméket?`)) {
      this.productService.deleteProduct(product._id).subscribe({
        next: () => {
          this.loadProducts();
          this.snackBar.open('A termék törölve lett!', 'Értem', { duration: 2000 });
        },
        error: () => {
          this.snackBar.open('A törlés nem sikerült!', 'Értem', { duration: 2000 });
        }
      });
    }
  }

}