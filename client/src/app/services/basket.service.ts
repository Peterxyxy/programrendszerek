import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { CartItem } from '../models/cart-item';
import { Address } from '../models/address';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private storageKey = 'basket';

  getBasket(): Partial<Order> | null {
    const basket = localStorage.getItem(this.storageKey);
    return basket ? JSON.parse(basket) : null;
  }

  saveBasket(order: Partial<Order>): void {
    localStorage.setItem(this.storageKey, JSON.stringify(order));
  }

  clearBasket(): void {
    localStorage.removeItem(this.storageKey);
  }

  addOrUpdateProduct(product: CartItem): void {
    let basket = this.getBasket() || { products: [], status: 'active' };
    const products = basket.products as CartItem[] || [];
    const idx = products.findIndex(p => p.productId === product.productId);
    if (idx > -1) {
      products[idx].quantity += product.quantity;
    } else {
      products.push(product);
    }
    basket.products = products;
    this.saveBasket(basket);
  }

  removeProduct(productId: string): void {
    let basket = this.getBasket();
    if (!basket || !basket.products) return;
    basket.products = (basket.products as CartItem[]).filter(p => p.productId !== productId);
    this.saveBasket(basket);
  }

  setShippingAddress(address: Address): void {
    let basket = this.getBasket() || { products: [], status: 'active' };
    basket.shippingAddress = address;
    this.saveBasket(basket);
  }
}