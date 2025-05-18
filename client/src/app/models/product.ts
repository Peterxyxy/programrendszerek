export class Product {
  constructor(
    public _id: string,
    public name: string,
    public price: number,
    public stock: number,
    public description?: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}