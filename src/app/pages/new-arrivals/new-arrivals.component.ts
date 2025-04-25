import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-new-arrivals',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './new-arrivals.component.html',
  styleUrls: ['./new-arrivals.component.css']
})
export class NewArrivalsComponent implements OnInit {
  newProducts: Product[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    // Simulate loading new products
    setTimeout(() => {
      this.newProducts = [
        {
          id: 1,
          name: 'New Summer Collection T-Shirt',
          description: 'Comfortable cotton t-shirt from our latest summer collection',
          price: 29.99,
          image: 'assets/images/products/tshirt-1.jpg',
          category: 'Clothing',
          subcategory: 'T-Shirts',
          brand: 'FashionBrand',
          rating: 4.5,
          reviews: 12,
          stock: 50,
          discount: 0,
          isNew: true
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
