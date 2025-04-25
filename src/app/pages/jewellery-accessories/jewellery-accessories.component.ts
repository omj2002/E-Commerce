import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-jewellery-accessories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './jewellery-accessories.component.html',
  styleUrl: './jewellery-accessories.component.css'
})
export class JewelleryAccessoriesComponent implements OnInit {
  products: Product[] = [];
  categories: {title: string, items: string[]}[] = [];
  isLoading: boolean = true;
  category: string = 'Jewellery & Accessories';
  
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private navService: NavService
  ) {}

  ngOnInit(): void {
    // Load products for the entire Jewellery & Accessories category
    this.productService.getProductsByCategory(this.category).subscribe(products => {
      this.products = products;
      this.isLoading = false;
    });
    
    // Load subcategories
    this.navService.getCategoryItems(this.category).subscribe(items => {
      this.categories = items;
    });
  }
  
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    alert(`${product.name} has been added to your cart!`);
  }
  
  getProductsBySubcategory(subcategory: string): Product[] {
    return this.products.filter(product => product.subcategory === subcategory);
  }
  
  getOtherAccessories(): Product[] {
    return this.products.filter(product => 
      product.subcategory !== 'Watches' && 
      product.subcategory !== 'Jewellery'
    );
  }
  
  trackByProduct(index: number, product: Product): number {
    return product.id;
  }
}
