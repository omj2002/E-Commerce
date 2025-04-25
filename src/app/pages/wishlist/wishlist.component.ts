import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];
  isLoading = true;

  constructor(
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.wishlistService.getWishlistItems().subscribe(items => {
      this.wishlistItems = items;
      this.isLoading = false;
    });
  }

  removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId);
  }

  addToCart(product: Product): void {
    // Implement add to cart functionality
    console.log('Adding to cart:', product);
  }

  navigateToProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }
}
