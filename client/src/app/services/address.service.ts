import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Address } from '../models/address';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = '/api/address';

  constructor(private http: HttpClient) {}

  // Now send username in the request body (JSON), not as a URL param
  addAddress(username: string, address: Address): Observable<Address[]> {
    return this.http.post<Address[]>(`${this.apiUrl}/add`, { username, address });
  }

  updateAddress(username: string, addressId: string, address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.apiUrl}/update`, { username, addressId, address });
  }

  getAddresses(username: string): Observable<Address[]> {
  return this.http.post<Address[]>(`${this.apiUrl}/list`, { username });
}
}