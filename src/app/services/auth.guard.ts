import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = new Router();
  const authService = new AuthService();

  // If the user is logged in, allow access
  if (authService.isLoggedIn) {
    return true;
  }

  // Otherwise, redirect to login page
  return router.createUrlTree(['/auth/login'], { 
    queryParams: { redirectUrl: state.url } 
  });
};

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLoggedIn) {
      return true;
    }

    // Redirect to the login page
    return this.router.createUrlTree(['/auth/login']);
  }
} 