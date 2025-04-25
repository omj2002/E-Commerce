import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, map, catchError } from 'rxjs';
import { Category } from './product.service';

export interface NavigationItem {
  category: string;
  sections: {
    title: string;
    items: string[];
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class NavService {
  private categoriesUrl = 'assets/data/categories.json';
  private categoriesCache: Category[] = [];
  private navigationDataCache: NavigationItem[] = [];
  
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private http: HttpClient) {
    // Pre-load categories
    this.loadCategories().subscribe();
  }

  private loadCategories(): Observable<Category[]> {
    this.isLoadingSubject.next(true);
    return this.http.get<{categories: Category[]}>(this.categoriesUrl).pipe(
      map(response => {
        this.categoriesCache = response.categories;
        this.transformToNavigationData(); // Transform to navigation format
        this.isLoadingSubject.next(false);
        return this.categoriesCache;
      }),
      catchError(error => {
        console.error('Error loading categories:', error);
        this.isLoadingSubject.next(false);
        return of([]);
      })
    );
  }

  private transformToNavigationData(): void {
    this.navigationDataCache = this.categoriesCache.map(category => {
      return {
        category: category.name,
        sections: category.subcategories.map(subcategory => {
          return {
            title: subcategory.name,
            items: subcategory.items
          };
        })
      };
    });
  }

  getNavigationData(): Observable<NavigationItem[]> {
    if (this.navigationDataCache.length > 0) {
      return of(this.navigationDataCache);
    }
    
    return this.loadCategories().pipe(
      map(() => this.navigationDataCache)
    );
  }

  getCategoryItems(categoryName: string): Observable<{title: string, items: string[]}[]> {
    return this.getNavigationData().pipe(
      map(navData => {
        const category = navData.find(item => 
          item.category.toLowerCase() === categoryName.toLowerCase()
        );
        return category ? category.sections : [];
      })
    );
  }
}