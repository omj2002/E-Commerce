import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-children',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.css']
})
export class ChildrenComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}
  
  ngOnInit(): void {
    this.productService.getProductsByCategory('Children').subscribe(products => {
      this.products = products;
      this.loading = false;
    });
  }
  
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    alert(`${product.name} has been added to the cart!`);
  }
}
