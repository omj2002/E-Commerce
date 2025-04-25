import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html', // External HTML file
  styleUrls: ['./category.component.css']   // External CSS file
})
export class CategoryComponent implements OnInit {
  products: Product[] = [];
  category: string = '';
  loading: boolean = true;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.category = params.get('category') || '';
        this.loading = true;
        return this.productService.getProductsByCategory(this.category);
      })
    ).subscribe(products => {
      this.products = products;
      this.loading = false;
    });
  }
}