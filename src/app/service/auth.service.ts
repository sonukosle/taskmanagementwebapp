import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'http://localhost:8080/api/auth/login';
  private router = inject(Router);

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ token: string } | any> {
    return this.http.post<{ token: string } | any>(this.loginUrl, { username, password }).pipe(
      tap((res: any) => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);

  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
