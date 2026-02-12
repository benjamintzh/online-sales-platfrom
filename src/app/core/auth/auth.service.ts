import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  email: string;
  password: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    let storedUser = null;
    if (this.isBrowser) {
      const storedUserString = localStorage.getItem('currentUser');
      storedUser = storedUserString ? JSON.parse(storedUserString) : null;
      console.log('AuthService initialized with user:', storedUser); // Debug log
    }
    
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Add this method to refresh user from localStorage
  public refreshUser(): void {
    if (!this.isBrowser) return;
    
    const storedUserString = localStorage.getItem('currentUser');
    const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
    console.log('Refreshing user from localStorage:', storedUser); // Debug log
    this.currentUserSubject.next(storedUser);
  }

  register(name: string, email: string, password: string): { success: boolean; message: string } {
    if (!this.isBrowser) {
      return { success: false, message: 'Registration not available on server' };
    }

    // Get existing users from localStorage
    const users = this.getUsers();

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Add new user
    const newUser: User = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return { success: true, message: 'Registration successful! Please login.' };
  }

  login(email: string, password: string): { success: boolean; message: string } {
    if (!this.isBrowser) {
      return { success: false, message: 'Login not available on server' };
    }

    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      // Store current user (without password for security)
      const userWithoutPassword = { ...user, password: '' };
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      this.currentUserSubject.next(userWithoutPassword);
      console.log('User logged in:', userWithoutPassword); // Debug log
      return { success: true, message: 'Login successful!' };
    }

    return { success: false, message: 'Invalid email or password' };
  }

  logout(): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    console.log('User logged out'); // Debug log
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  private getUsers(): User[] {
    if (!this.isBrowser) {
      return [];
    }

    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }
}