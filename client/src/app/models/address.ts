export class Address {
  constructor(
    public _id: string,
    public street?: string,
    public city?: string,
    public county?: string,
    public postalCode?: string,
    public country?: string
  ) {}
}