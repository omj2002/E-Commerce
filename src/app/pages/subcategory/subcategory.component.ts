import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subcategory',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})
export class SubcategoryComponent implements OnInit {
  category: string = '';
  subcategory: string = '';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading: boolean = true;
  sortOption: string = 'featured';

  // Filter properties
  priceFilters = {
    under25: false,
    from25to50: false,
    from50to100: false,
    over100: false
  };

  ratingFilters = {
    fourStarsAndUp: false,
    threeStarsAndUp: false,
    twoStarsAndUp: false
  };

  availabilityFilters = {
    inStock: false,
    outOfStock: false
  };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Handle both route patterns - route params and route data
    this.route.paramMap.subscribe(params => {
      // Check if we have data from the router (static routes)
      if (this.route.snapshot.data['category'] && this.route.snapshot.data['subcategory']) {
        this.category = this.route.snapshot.data['category'];
        this.subcategory = this.route.snapshot.data['subcategory'];
        this.loadProducts();
      } 
      // Check if we have params from the dynamic route
      else if (params.get('category') && params.get('subcategory')) {
        this.category = params.get('category') || '';
        this.subcategory = params.get('subcategory') || '';
        this.loadProducts();
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProductsBySubcategory(this.category, this.subcategory)
      .subscribe(products => {
        this.products = products;
        this.applyFilters(); // Initially apply filters (which will be all products at first)
        this.loading = false;
      });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    alert(`${product.name} has been added to the cart!`);
  }

  applyFilters(): void {
    // Start with all products
    let result = [...this.products];
    
    // Apply price filters
    if (this.priceFilters.under25 || this.priceFilters.from25to50 || 
        this.priceFilters.from50to100 || this.priceFilters.over100) {
      result = result.filter(product => {
        return (this.priceFilters.under25 && product.price < 25) || 
               (this.priceFilters.from25to50 && product.price >= 25 && product.price < 50) ||
               (this.priceFilters.from50to100 && product.price >= 50 && product.price < 100) ||
               (this.priceFilters.over100 && product.price >= 100);
      });
    }
    
    // Apply rating filters
    if (this.ratingFilters.fourStarsAndUp || this.ratingFilters.threeStarsAndUp || 
        this.ratingFilters.twoStarsAndUp) {
      result = result.filter(product => {
        const rating = product.rating || 0; // Default to 0 if rating is undefined
        return (this.ratingFilters.fourStarsAndUp && rating >= 4) || 
               (this.ratingFilters.threeStarsAndUp && rating >= 3) ||
               (this.ratingFilters.twoStarsAndUp && rating >= 2);
      });
    }
    
    // Apply availability filters
    if (this.availabilityFilters.inStock || this.availabilityFilters.outOfStock) {
      result = result.filter(product => {
        return (this.availabilityFilters.inStock && product.inStock) || 
               (this.availabilityFilters.outOfStock && !product.inStock);
      });
    }
    
    // Apply sorting
    if (this.sortOption === 'price_low') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.sortOption === 'price_high') {
      result.sort((a, b) => b.price - a.price);
    } else if (this.sortOption === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); // Default to 0 if rating is undefined
    }
    // Featured is default, no sorting needed
    
    this.filteredProducts = result;
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortOption = select.value;
    this.applyFilters();
  }
  
  resetFilters(): void {
    // Reset price filters
    this.priceFilters = {
      under25: false,
      from25to50: false,
      from50to100: false,
      over100: false
    };
    
    // Reset rating filters
    this.ratingFilters = {
      fourStarsAndUp: false,
      threeStarsAndUp: false,
      twoStarsAndUp: false
    };
    
    // Reset availability filters
    this.availabilityFilters = {
      inStock: false,
      outOfStock: false
    };
    
    // Reset to featured sort
    this.sortOption = 'featured';
    
    // Apply the reset
    this.applyFilters();
  }
}