import { Address } from './address';
import { CartItem } from './cart-item';

export type OrderStatus = 'active' | 'completed' | 'canceled';

export class Order {
  constructor(
    public _id: string,
    public buyer: string, // user ID
    public products: CartItem[],
    public totalPrice: number,
    public shippingAddress: Address | string,
    public status: OrderStatus = 'active',
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}