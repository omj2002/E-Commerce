import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = Number(params.get('id'));
      this.loadProduct(productId);
    });
  }

  loadProduct(productId: number): void {
    this.loading = true;
    this.productService.getProduct(productId).subscribe(product => {
      this.product = product || null;
      this.loading = false;
      
      // Load related products
      if (product) {
        this.loadRelatedProducts(product);
      }
    });
  }

  loadRelatedProducts(product: Product): void {
    // Get products from the same category
    this.productService.getProductsByCategory(product.category).subscribe(products => {
      // Filter out current product and limit to 4 related products
      this.relatedProducts = products
        .filter(p => p.id !== product.id)
        .slice(0, 4);
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    alert(`${product.name} has been added to the cart!`);
  }

  toggleWishlist(product: Product): void {
    if (this.isInWishlist(product)) {
      this.wishlistService.removeFromWishlist(product.id);
    } else {
      this.wishlistService.addToWishlist(product);
    }
  }

  isInWishlist(product: Product): boolean {
    return this.wishlistService.isInWishlist(product.id);
  }
}