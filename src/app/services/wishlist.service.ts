import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems: any[] = [];
  private wishlistSubject = new BehaviorSubject<any[]>([]);

  constructor() {
    // Load wishlist from localStorage on service initialization
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlistItems = JSON.parse(savedWishlist);
      this.wishlistSubject.next(this.wishlistItems);
    }
  }

  getWishlistItems(): Observable<any[]> {
    return this.wishlistSubject.asObservable();
  }

  addToWishlist(item: any): void {
    if (!this.wishlistItems.some(wishlistItem => wishlistItem.id === item.id)) {
      this.wishlistItems.push(item);
      this.updateWishlist();
    }
  }

  removeFromWishlist(itemId: number): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== itemId);
    this.updateWishlist();
  }

  isInWishlist(itemId: number): boolean {
    return this.wishlistItems.some(item => item.id === itemId);
  }

  private updateWishlist(): void {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
    this.wishlistSubject.next(this.wishlistItems);
  }

  clearWishlist(): void {
    this.wishlistItems = [];
    this.updateWishlist();
  }
}
