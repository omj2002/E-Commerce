import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-women',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './women.component.html',
  styleUrls: ['./women.component.css']
})
export class WomenComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;

  constructor(
    private productService: ProductService, 
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getProductsByCategory('Women').subscribe(products => {
      this.products = products;
      this.loading = false;
    });
  }
  
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    alert(`${product.name} has been added to the cart!`);
  }
}
