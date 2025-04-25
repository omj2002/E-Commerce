import { Component, OnInit } from '@angular/core';
import { ProductService, Product, Category } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, forkJoin, map, tap } from 'rxjs';

interface CategoryProducts {
  categoryName: string;
  products: Product[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  productsByCategory: { [key: string]: Product[] } = {};
  categories: Category[] = [];
  isLoading = true;
  
  featuredProducts$: Observable<Product[]>;
  categories$: Observable<Category[]>;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.featuredProducts$ = this.productService.getFeaturedProducts(8);
    
    this.categories$ = this.productService.getCategories().pipe(
      tap(categories => {
        this.categories = categories;
        this.isLoading = false;
      })
    );
  }

  ngOnInit(): void {
    this.loadCategoryProducts();
  }

  loadCategoryProducts(): void {
    this.categories$.subscribe(categories => {
      // Create observables for each category's products
      const categoryObservables: Observable<CategoryProducts>[] = categories.map(category => {
        return this.productService.getProductsByCategory(category.name).pipe(
          map(products => ({ 
            categoryName: category.name, 
            products: products 
          }))
        );
      });
      
      // Use forkJoin to wait for all observables to complete
      forkJoin(categoryObservables).subscribe(results => {
        results.forEach(result => {
          this.productsByCategory[result.categoryName] = result.products;
        });
      });
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    alert(`${product.name} has been added to the cart!`);
  }

  trackByProduct(index: number, product: Product): number {
    return product.id;
  }

  trackByCategory(index: number, category: Category): number {
    return category.id;
  }
}