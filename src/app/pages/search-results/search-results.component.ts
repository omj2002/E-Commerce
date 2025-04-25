import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartComponent } from '../../cart/cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CartComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  products: Product[] = [];
  query: string = '';
  loading: boolean = true;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(
      switchMap(params => {
        this.query = params['q'] || '';
        this.loading = true;
        return this.productService.searchProducts(this.query);
      })
    ).subscribe(products => {
      this.products = products;
      this.loading = false;
    });
  }
}





