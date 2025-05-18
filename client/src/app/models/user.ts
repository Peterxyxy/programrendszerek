import { Address } from './address';
import { CartItem } from './cart-item';

export class User {
  constructor(
    public _id: string,
    public username: string,
    public role: 'admin' | 'buyer' | 'guest',
    public cart: CartItem[] = [],
    public address: Address[] = [],
    public signupDate?: Date,
    public password?: string
  ) {}

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  isBuyer(): boolean {
    return this.role === 'buyer';
  }

  isGuest(): boolean {
    return this.role === 'guest';
  }

  addToCart(productId: string, quantity: number): void {
    const item = this.cart.find(i => i.productId === productId);
    if (item) {
      item.quantity += quantity;
    } else {
      this.cart.push(new CartItem(productId, quantity));
    }
  }

  removeFromCart(productId: string): void {
    this.cart = this.cart.filter(i => i.productId !== productId);
  }
}