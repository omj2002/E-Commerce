import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  
  cartItems$ = this.cartItemsSubject.asObservable();
  
  constructor() {
    // Load cart from localStorage if available
    this.loadCart();
  }
  
  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cartItems = JSON.parse(savedCart);
        this.cartItemsSubject.next([...this.cartItems]);
      } catch (e) {
        console.error('Error loading cart from localStorage:', e);
      }
    }
  }
  
  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cartItemsSubject.next([...this.cartItems]);
  }

  // Add a product to the cart
  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1; // Increment quantity if product already exists
    } else {
      this.cartItems.push({ product, quantity: 1 }); // Add new product with quantity 1
    }
    
    this.saveCart();
  }

  // Get all cart items
  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  // Remove a product from the cart
  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.saveCart();
  }
  
  // Update quantity of a cart item
  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity); // Ensure quantity is at least 1
      this.saveCart();
    }
  }

  // Clear the cart
  clearCart(): void {
    this.cartItems = [];
    this.saveCart();
  }
  
  // Get total price of cart
  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + (item.product.price * item.quantity), 
      0
    );
  }
  
  // Get total number of items in cart
  getCartItemCount(): number {
    return this.cartItems.reduce(
      (count, item) => count + item.quantity, 
      0
    );
  }
}