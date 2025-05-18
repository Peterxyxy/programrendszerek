import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private router: Router, private http: HttpClient) {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  public login(username: string, password: string): Observable<User> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<User>('/api/user/login', { username, password }, { headers })
      .pipe(
        map(loginResponse => {
          localStorage.setItem('user', JSON.stringify(loginResponse));
          this.currentUser = loginResponse as User;
          return loginResponse;
        })
      );
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  getUser(): User | null {
    if (!this.currentUser) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
    }

    return this.currentUser;
  }

  getRole(): string | null {
    return this.getUser()?.role || null;
  }

  logout(): void {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    this.http.post('/api/user/logout', {headers}).subscribe({
      next: () => {
        localStorage.removeItem('user');
        this.currentUser = null;
        this.router.navigate(['/app/login']);
      },
      error: () => {
        localStorage.removeItem('user');
        this.currentUser = null;
        this.router.navigate(['/app/login']);
      }
    });
  }

  public register(username: string, password: string): Observable<User> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<User>('/api/user/register', { username, password }, { headers });
  }
}