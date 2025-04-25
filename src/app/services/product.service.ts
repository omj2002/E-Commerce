import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError, BehaviorSubject } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  subcategory: string;
  rating?: number;
  inStock?: boolean;
  features?: string[];
}

export interface Category {
  id: number;
  name: string;
  imageUrl: string;
  subcategories: {
    id: number;
    name: string;
    items: string[];
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'assets/data/products.json';
  private categoriesUrl = 'assets/data/categories.json';
  
  private productsCache: Product[] = [];
  private categoriesCache: Category[] = [];
  
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private http: HttpClient) {
    // Pre-load products and categories
    this.loadProducts().subscribe();
    this.loadCategories().subscribe();
  }

  private loadProducts(): Observable<Product[]> {
    this.isLoadingSubject.next(true);
    return this.http.get<{products: Product[]}>(this.productsUrl).pipe(
      map(response => {
        this.productsCache = response.products;
        this.isLoadingSubject.next(false);
        return this.productsCache;
      }),
      catchError(error => {
        console.error('Error loading products:', error);
        this.isLoadingSubject.next(false);
        return of([]);
      })
    );
  }

  private loadCategories(): Observable<Category[]> {
    return this.http.get<{categories: Category[]}>(this.categoriesUrl).pipe(
      map(response => {
        this.categoriesCache = response.categories;
        return this.categoriesCache;
      }),
      catchError(error => {
        console.error('Error loading categories:', error);
        return of([]);
      })
    );
  }

  getProducts(): Observable<Product[]> {
    if (this.productsCache.length > 0) {
      return of(this.productsCache);
    }
    return this.loadProducts();
  }

  getProduct(id: number): Observable<Product | undefined> {
    if (this.productsCache.length > 0) {
      const product = this.productsCache.find(p => p.id === id);
      return of(product);
    }
    
    return this.getProducts().pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      ))
    );
  }

  getProductsBySubcategory(category: string, subcategory: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase() && 
        product.subcategory.toLowerCase() === subcategory.toLowerCase()
      ))
    );
  }

  getCategories(): Observable<Category[]> {
    if (this.categoriesCache.length > 0) {
      return of(this.categoriesCache);
    }
    return this.loadCategories();
  }

  getCategoryByName(name: string): Observable<Category | undefined> {
    return this.getCategories().pipe(
      map(categories => categories.find(c => 
        c.name.toLowerCase() === name.toLowerCase()
      ))
    );
  }

  getSubcategories(category: string): Observable<string[]> {
    return this.getCategories().pipe(
      map(categories => {
        const foundCategory = categories.find(c => 
          c.name.toLowerCase() === category.toLowerCase()
        );
        if (foundCategory) {
          return foundCategory.subcategories.map(sub => sub.name);
        }
        return [];
      })
    );
  }

  getFeaturedProducts(count: number = 8): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => {
        // Get random products for featured section
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      })
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    if (!query || query.trim() === '') {
      return of([]);
    }
    
    return this.getProducts().pipe(
      map(products => products.filter(product => {
        const searchTerm = query.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.subcategory.toLowerCase().includes(searchTerm)
        );
      }))
    );
  }
}