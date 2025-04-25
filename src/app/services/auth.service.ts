import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // In a real app, never store plain text passwords
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'ecommerce_user';
  private readonly USERS_KEY = 'ecommerce_users';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    // Check if user is already logged in
    this.initFromLocalStorage();
  }

  private initFromLocalStorage(): void {
    const userData = localStorage.getItem(this.STORAGE_KEY);
    if (userData) {
      const user = JSON.parse(userData);
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
    }
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // In a real app, this would be a real API call
  login(email: string, password: string): Observable<{ success: boolean; message: string }> {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      return of({ success: true, message: 'Login successful' }).pipe(
        delay(500),
        tap(() => {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.isLoggedInSubject.next(true);
        })
      );
    } else {
      return of({ success: false, message: 'Invalid email or password' }).pipe(delay(500));
    }
  }

  register(name: string, email: string, password: string): Observable<{ success: boolean; message: string }> {
    const users = this.getUsers();
    const userExists = users.some(u => u.email === email);

    if (userExists) {
      return of({ success: false, message: 'Email already registered' }).pipe(delay(500));
    } else {
      const newUser: User = {
        id: this.generateUserId(),
        name,
        email,
        password
      };

      users.push(newUser);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

      return of({ success: true, message: 'Registration successful' }).pipe(delay(500));
    }
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  private getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private generateUserId(): number {
    const users = this.getUsers();
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  }
} 