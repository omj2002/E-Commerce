import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Category {
  id: string | number;
  name: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string | number;
  name: string;
  items?: string[];
}

interface CategoriesResponse {
  categories: Category[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly categoriesUrl = 'assets/data/categories.json';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<CategoriesResponse>(this.categoriesUrl).pipe(
      map(response => response.categories || []),
      catchError(error => {
        console.error('Error fetching categories', error);
        return of([]);
      })
    );
  }

  getCategoryById(id: string): Observable<Category | undefined> {
    return this.getCategories().pipe(
      map(categories => categories.find(category => category.id.toString() === id)),
      catchError(error => {
        console.error(`Error fetching category with id ${id}`, error);
        return of(undefined);
      })
    );
  }
} 