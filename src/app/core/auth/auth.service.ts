import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_KEY = 'currentUser';

  private currentUserSubject: BehaviorSubject<CurrentUser | null>;
  public currentUser$: Observable<CurrentUser | null>;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    let storedUser: CurrentUser | null = null;
    if (this.isBrowser) {
      const raw = localStorage.getItem(this.USER_KEY);
      storedUser = raw ? JSON.parse(raw) : null;
    }

    this.currentUserSubject = new BehaviorSubject<CurrentUser | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // ── Public getters ──────────────────────────────────────────────────────────

  get currentUserValue(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUserValue;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'ADMIN';
  }

  // ── API calls ───────────────────────────────────────────────────────────────

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, { name, email, password }).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, { email, password }).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private handleAuthSuccess(response: AuthResponse): void {
    if (!this.isBrowser) return;

    const user: CurrentUser = {
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role,
    };

    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
