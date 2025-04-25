import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, Category } from './services/product.service';
import { Router } from '@angular/router';
import { SecondaryNavbarComponent } from './shared/secondary-navbar/secondary-navbar.component';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { Observable, map, of, Subscription } from 'rxjs';
import { NavService, NavigationItem } from './services/nav.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule, SecondaryNavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ecommerce-store';
  categories: Category[] = [];
  subcategories: any = {};
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  showCategories: boolean = false;
  activeCategory: string | null = null;
  mobileMenuOpen: boolean = false;
  isMobile: boolean = false;
  cartItemCount = 0;
  isLoggedIn = false;
  routerSub: Subscription;
  activeMobileCategory: string | null = null;
  navigationItems: NavigationItem[] = [];
  
  constructor(
    private productService: ProductService, 
    private router: Router,
    public authService: AuthService,
    public cartService: CartService,
    private navService: NavService
  ) {
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Close mobile menu on navigation
        this.mobileMenuOpen = false;
        this.toggleBodyScroll(false);
      }
    });
  }
  
  ngOnInit() {
    // Fetch categories for search dropdown
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    
    // Check if it's mobile view
    this.checkScreenSize();

    // Load navigation data
    this.loadNavigationData();

    // Subscribe to cart updates
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    });

    // Check auth status
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
    if (window.innerWidth > 768 && this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
      this.toggleBodyScroll(false);
    }
  }
  
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }
  
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (!this.mobileMenuOpen) {
      this.activeCategory = null;
    }
    
    // Prevent scrolling when menu is open
    this.toggleBodyScroll(this.mobileMenuOpen);
  }
  
  closeMobileMenu() {
    this.mobileMenuOpen = false;
    this.activeCategory = null;
    this.toggleBodyScroll(false);
  }
  
  toggleCategory(categoryId: string) {
    if (this.isMobile) {
      this.activeCategory = this.activeCategory === categoryId ? null : categoryId;
    }
  }
  
  filterProducts() {
    if (this.searchQuery.length >= 2) {
      this.productService.searchProducts(this.searchQuery).subscribe(products => {
        this.filteredProducts = products;
      });
    } else {
      this.filteredProducts = [];
    }
  }
  
  selectCategory(category: string) {
    this.router.navigate(['/category', category]);
    this.showCategories = false;
    this.closeMobileMenu();
  }
  
  selectProduct(product: Product) {
    this.router.navigate(['/products', product.id]);
    this.searchQuery = '';
    this.filteredProducts = [];
    this.closeMobileMenu();
  }
  
  onSearch(event: Event) {
    event.preventDefault();
    if (this.searchQuery) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
      this.searchQuery = '';
      this.filteredProducts = [];
    }
  }
  
  hideDropdownDelayed() {
    setTimeout(() => {
      this.showCategories = false;
      this.filteredProducts = [];
    }, 200);
  }
  
  getCartItemCount(): number {
    return this.cartService.getCartItemCount();
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  loadNavigationData(): void {
    this.navService.getNavigationData().subscribe({
      next: (navigationItems: NavigationItem[]) => {
        this.navigationItems = navigationItems;
        // Extract categories from navigation items for the dropdown
        this.categories = navigationItems.map(item => ({
          id: parseInt(item.category.split('-')[0]) || 0,
          name: item.category,
          imageUrl: '',
          subcategories: []
        }));
      },
      error: (error: any) => {
        console.error('Error loading navigation data', error);
      }
    });
  }

  getSubcategories(category: Category): string[] {
    if (category && category.name) {
      // Find the corresponding navigation item
      const navItem = this.navigationItems.find(item => 
        item.category.toLowerCase() === category.name.toLowerCase());
      
      if (navItem && navItem.sections) {
        // Flatten all section items into a single array
        return navItem.sections.reduce((items: string[], section) => {
          return [...items, ...section.items];
        }, []);
      }
    }
    return [];
  }

  organizeSubcategories(subcategories: string[]): any[] {
    // Group subcategories into columns for the mega menu
    const groupSize = Math.ceil(subcategories.length / 3); // 3 columns
    const groups = [];
    
    for (let i = 0; i < subcategories.length; i += groupSize) {
      groups.push(subcategories.slice(i, i + groupSize));
    }
    
    return groups;
  }

  toggleMobileCategory(categoryId: string): void {
    if (this.activeMobileCategory === categoryId) {
      this.activeMobileCategory = null;
    } else {
      this.activeMobileCategory = categoryId;
    }
  }

  toggleBodyScroll(disable: boolean): void {
    if (disable) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}