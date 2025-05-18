import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Address } from '../models/address';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/user';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Get the current user by username
  getCurrentUser(): Observable<User> {
    const user = this.authService.getUser();
    if (!user || !user.username) {
      throw new Error('No logged in user');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getUser() || ''}`
    });
    return this.http.get<User>(`${this.apiUrl}/${user.username}`, { headers });
  }

  // Update the current user by username
  updateCurrentUser(userData: Partial<User>): Observable<User> {
    const user = this.authService.getUser();
    if (!user || !user.username) {
      throw new Error('No logged in user');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getUser() || ''}`
    });
    return this.http.put<User>(`${this.apiUrl}/${user.username}`, userData, { headers });
  }

  // Delete the current user by username
  deleteCurrentUser(): Observable<void> {
    const user = this.authService.getUser();
    if (!user || !user.username) {
      throw new Error('No logged in user');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getUser() || ''}`
    });
    return this.http.delete<void>(`${this.apiUrl}/${user.username}`, { headers });
  }

  // Get a user by username
  getUserByUsername(username: string): Observable<User> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getUser() || ''}`
    });
    return this.http.get<User>(`${this.apiUrl}/${username}`, { headers });
  }

  // Add a new address to the user by username
  addAddress(username: string, address: Address): Observable<Address[]> {
    return this.http.post<Address[]>(`${this.apiUrl}/${username}/address`, address);
  }

  // Update an existing address for the user by username
  updateAddress(username: string, addressId: string, address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.apiUrl}/${username}/address/${addressId}`, address);
  }
}