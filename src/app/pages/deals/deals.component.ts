import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent implements OnInit {
  dealProducts: Product[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    // Simulate loading deal products
    setTimeout(() => {
      this.dealProducts = [
        {
          id: 1,
          name: 'Premium Leather Wallet',
          description: 'Genuine leather wallet with multiple card slots',
          price: 1499,
          image: 'assets/images/products/wallet.jpg',
          category: 'Accessories',
          rating: 4.8,
          stock: 25,
          discount: 33, // 33% discount
          isNew: false,
          isFeatured: true
        },
        // Add more products as needed
      ];
      this.isLoading = false;
    }, 1000);
  }

  calculateDiscountedPrice(price: number, discount: number): number {
    return price - (price * discount / 100);
  }

  addToWishlist(product: Product): void {
    if (this.isInWishlist(product)) {
      this.wishlistService.removeFromWishlist(product.id);
    } else {
      this.wishlistService.addToWishlist(product);
    }
  }

  addToCart(product: Product): void {
    // Implement add to cart functionality
    console.log('Adding to cart:', product);
  }

  navigateToProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  isInWishlist(product: Product): boolean {
    return this.wishlistService.isInWishlist(product.id);
  }
}
