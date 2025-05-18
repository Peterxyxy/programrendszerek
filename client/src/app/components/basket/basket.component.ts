import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../services/basket.service';
import { CartItem } from '../../models/cart-item';
import { Product } from '../../models/product';
import { Order } from '../../models/order';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ProductFormComponent } from '../product-form/product-form.component';
import { OrderService } from '../../services/order.service';
import { Address } from '../../models/address';
import { AddressService } from '../../services/address.service';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
    imports: [
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    CurrencyPipe,
    CommonModule,
    MatSelectModule,
    FormsModule
    
  ]
})
export class BasketComponent implements OnInit {
  basket: Partial<Order> | null = null;
  products: CartItem[] = [];
  productMap: { [id: string]: Product } = {};
  addresses: Address[] = [];
  selectedAddressId: string | null = null;

  constructor(
    private basketService: BasketService,
    private addressService: AddressService,
    private productService: ProductService,
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBasket();
    // Load addresses for the current user
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.username) {
      this.addressService.getAddresses(user.username).subscribe(addresses => {
        this.addresses = addresses;
        if (addresses.length > 0) {
          this.selectedAddressId = addresses[0]._id;
          this.onAddressChange();
        }
      });
    }
  }

  onAddressChange() {
    const selected = this.addresses.find(a => a._id === this.selectedAddressId);
    if (selected) {
      this.basketService.setShippingAddress(selected);
    }
  }

  orderBasket() {
    const basket = this.basketService.getBasket();
    if (!basket || !basket.products || basket.products.length === 0) {
      this.snackBar.open('A kosár üres!', 'Értem', { duration: 2000 });
      return;
    }
    if (!this.selectedAddressId) {
      this.snackBar.open('Válassz szállítási címet!', 'Értem', { duration: 2000 });
      return;
    }
    this.orderService.createOrder(basket).subscribe({
      next: () => {
        this.snackBar.open('Megrendelés sikeres!', 'Értem', { duration: 2000 });
        this.clearBasket();
      },
      error: () => {
        this.snackBar.open('A megrendelés nem sikerült!', 'Értem', { duration: 2000 });
      }
    });
  }

loadBasket() {
  this.basket = this.basketService.getBasket();
  this.products = this.basket?.products as CartItem[] || [];

  // Fetch each product by ID and build the productMap
  this.productMap = {};
  this.products.forEach(item => {
    this.productService.getProductById(item.productId).subscribe(product => {
      this.productMap[item.productId] = product;
    });
  });
}

getProductPrice(productId: string): number {
  return this.productMap[productId]?.price ?? 0;
}

  clearBasket() {
    this.basketService.clearBasket();
    this.loadBasket();
  }

    removeProduct(productId: string) {
    this.basketService.removeProduct(productId);
    this.loadBasket();
  }

  getProductName(productId: string): string {
  return this.productMap[productId]?.name ?? '';
}

getTotal(): number {
  return this.products.reduce(
    (sum, item) => sum + this.getProductPrice(item.productId) * item.quantity,
    0
  );
}
}