import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../services/product.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartComponent } from '../cart/cart.component';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterModule, CommonModule, CartComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}
  
  ngOnInit() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.loading = false;
      console.log('Products:', this.products);
    });
  }
  
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    alert(`${product.name} has been added to the cart!`);
  }
}