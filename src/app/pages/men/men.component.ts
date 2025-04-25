import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-men',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './men.component.html',
  styleUrls: ['./men.component.css']
})
export class MenComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;

  constructor(
    private productService: ProductService, 
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getProductsByCategory('Men').subscribe(products => {
      this.products = products;
      this.loading = false;
    });
  }
  
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    alert(`${product.name} has been added to the cart!`);
  }
}