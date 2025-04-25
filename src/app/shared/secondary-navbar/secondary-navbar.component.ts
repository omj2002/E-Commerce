import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { NavService, NavigationItem } from '../../services/nav.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { CategoryService, Category } from '../../services/category.service';
import { HttpClient } from '@angular/common/http';

// Define interfaces for our category data structure
interface CategoryItem {
  id: string;
  name: string;
  sections: SectionItem[];
}

interface SectionItem {
  name: string;
  items: ProductItem[];
}

interface ProductItem {
  id: string;
  name: string;
}

@Component({
  selector: 'app-secondary-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './secondary-navbar.component.html',
  styleUrls: ['./secondary-navbar.component.css']
})
export class SecondaryNavbarComponent implements OnInit, OnDestroy {
  @ViewChild('navContainer') navContainer!: ElementRef;
  
  navigationData: NavigationItem[] = [];
  categories: CategoryItem[] = [];
  navigationSubscription: Subscription | null = null;
  categoriesSubscription: Subscription | null = null;
  isLoading: boolean = true;
  activeDropdown: string | null = null;
  activeCategoryId: string | null = null;
  isMobile: boolean = false;
  mobileMenuOpen: boolean = false;
  showOverlay = false;
  hoverTimeouts: { [key: string]: any } = {};

  constructor(
    private navService: NavService,
    private renderer: Renderer2,
    private categoryService: CategoryService,
    private http: HttpClient
  ) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    // Disabling navService load for now
    // this.loadNavigationData();
    // Try direct loading instead
    this.loadCategoriesDirectly();
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
    // Clean up any body classes
    this.renderer.removeClass(document.body, 'menu-open');
    this.renderer.removeClass(document.body, 'nav-open');
  }

  loadNavigationData(): void {
    this.isLoading = true;
    this.navigationSubscription = this.navService.getNavigationData().subscribe({
      next: (data) => {
        this.navigationData = data;
        this.isLoading = false;
        // Transform navigation data to match our new data structure
        this.transformNavigationData();
      },
      error: (error) => {
        console.error('Error loading navigation data:', error);
        this.isLoading = false;
      }
    });
  }

  // Transform the existing navigation data to our new format
  transformNavigationData(): void {
    this.categories = this.navigationData.map(item => {
      return {
        id: item.category,
        name: item.category,
        sections: item.sections.map(section => {
          return {
            name: section.title,
            items: section.items.map(itemName => {
              return {
                id: itemName.toLowerCase().replace(/\s+/g, '-'),
                name: itemName
              };
            })
          };
        })
      };
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
    
    // Reposition any active dropdown
    if (this.activeCategoryId !== null && !this.isMobile) {
      setTimeout(() => {
        this.positionDropdown(this.activeCategoryId as string);
      }, 0);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.isMobile) {
      const target = event.target as HTMLElement;
      if (!target.closest('.nav-item')) {
        this.activeCategoryId = null;
      }
    }
  }

  checkScreenSize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 992;
    
    // Clean up if transitioning between views
    if (wasMobile !== this.isMobile) {
      this.closeAllDropdowns();
      this.closeMobileMenu();
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.showOverlay = this.mobileMenuOpen;
    if (!this.mobileMenuOpen) {
      this.activeCategoryId = null;
    }
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    this.showOverlay = false;
    this.activeCategoryId = null;
  }

  closeDropdownAndMenu() {
    this.closeAllDropdowns();
    this.closeMobileMenu();
  }

  toggleCategory(event: Event, categoryId: string): void {
    if (this.isMobile) {
      event.preventDefault();
      event.stopPropagation();
      
      // Toggle this category (close if it was already open)
      if (this.activeCategoryId === categoryId) {
        this.activeCategoryId = null;
      } else {
        // First close any open dropdown with animation
        const prevCategory = this.activeCategoryId;
        if (prevCategory) {
          // Give time for closing animation
          this.activeCategoryId = null;
          setTimeout(() => {
            this.activeCategoryId = categoryId;
          }, 50);
        } else {
          this.activeCategoryId = categoryId;
        }
      }
    }
  }

  // Preserve existing tracking methods
  trackByCategory(index: number, item: NavigationItem): string {
    return item.category;
  }

  trackBySection(index: number, section: {title: string, items: string[]}): string {
    return section.title;
  }

  trackByItem(index: number, item: string): string {
    return item;
  }
  
  /* Methods to handle mouseover */
  onMouseEnter(categoryId: string): void {
    if (!this.isMobile) {
      // Clear any existing timeout for this category
      if (this.hoverTimeouts[categoryId]) {
        clearTimeout(this.hoverTimeouts[categoryId]);
        delete this.hoverTimeouts[categoryId];
      }
      
      // Clear any other close timeouts that might be running
      Object.keys(this.hoverTimeouts).forEach(key => {
        clearTimeout(this.hoverTimeouts[key]);
        delete this.hoverTimeouts[key];
      });
      
      // Set this category as active immediately
      this.activeCategoryId = categoryId;
      this.showOverlay = true;
      
      // Position the dropdown below the nav item
      setTimeout(() => {
        this.positionDropdown(categoryId);
      }, 0);
    }
  }

  onMouseLeave(categoryId: string): void {
    if (!this.isMobile && this.activeCategoryId === categoryId) {
      // Set a longer delay before closing to allow movement between items
      this.hoverTimeouts[categoryId] = setTimeout(() => {
        if (this.activeCategoryId === categoryId) {
          this.activeCategoryId = null;
          this.showOverlay = false;
        }
        delete this.hoverTimeouts[categoryId];
      }, 300); // 300ms delay - enough time to move to dropdown
    }
  }

  // Add a method to handle hovering on the dropdown itself
  onDropdownMouseEnter(categoryId: string): void {
    if (!this.isMobile) {
      // Clear any existing timeout that would close this dropdown
      if (this.hoverTimeouts[categoryId]) {
        clearTimeout(this.hoverTimeouts[categoryId]);
        delete this.hoverTimeouts[categoryId];
      }
      
      // Keep dropdown open
      this.activeCategoryId = categoryId;
      this.showOverlay = true;
    }
  }

  // Add a method to handle mouse leaving the dropdown
  onDropdownMouseLeave(categoryId: string): void {
    if (!this.isMobile) {
      // Add a delay before closing
      this.hoverTimeouts[categoryId] = setTimeout(() => {
        if (this.activeCategoryId === categoryId) {
          this.activeCategoryId = null;
          this.showOverlay = false;
        }
        delete this.hoverTimeouts[categoryId];
      }, 300); // 300ms delay
    }
  }

  closeAllDropdowns(): void {
    this.activeCategoryId = null;
    this.showOverlay = false;
    
    // Clear all timeouts
    Object.keys(this.hoverTimeouts).forEach(key => {
      clearTimeout(this.hoverTimeouts[key]);
      delete this.hoverTimeouts[key];
    });
  }

  // Direct method to load categories without service transform
  loadCategoriesDirectly(): void {
    this.isLoading = true;
    console.log('Starting to load categories directly...');
    
    this.http.get<{categories: any[]}>("assets/data/categories.json").subscribe({
      next: (response) => {
        console.log('Raw categories data:', response);
        
        if (response && response.categories && Array.isArray(response.categories)) {
          const rawCategories = response.categories;
          console.log(`Found ${rawCategories.length} raw categories`);
          
          // Simple transformation
          this.categories = rawCategories.map(cat => ({
            id: cat.id.toString(),
            name: cat.name,
            sections: (cat.subcategories || []).map((sub: any) => ({
              name: sub.name,
              items: (sub.items || []).map((item: any) => ({
                id: typeof item === 'string' ? item.toLowerCase().replace(/\s+/g, '-') : 'unknown',
                name: typeof item === 'string' ? item : 'Unknown Item'
              }))
            }))
          }));
          
          console.log('Processed categories:', this.categories);
        } else {
          console.error('Invalid categories data format:', response);
          this.categories = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories directly:', err);
        this.isLoading = false;
        this.categories = [];
      }
    });
  }
  
  // Helper method to generate URL-friendly names
  getSectionUrlName(sectionName: string): string {
    return sectionName.toLowerCase().replace(/\s+/g, '-');
  }

  // Original method (not used currently)
  loadCategories(): void {
    this.isLoading = true;
    console.log('Starting to load categories via service...');
    
    this.categoriesSubscription = this.categoryService.getCategories().subscribe({
      next: (categories) => {
        console.log('Categories received via service:', categories);
        
        if (categories && Array.isArray(categories)) {
          console.log(`Found ${categories.length} categories via service`);
          
          // Transform the Category[] to CategoryItem[]
          try {
            this.categories = categories.map(category => {
              return {
                id: category.id.toString(),
                name: category.name,
                sections: Array.isArray(category.subcategories) ? 
                  category.subcategories.map(subcategory => {
                    return {
                      name: subcategory.name,
                      items: subcategory.items && Array.isArray(subcategory.items) ? 
                        subcategory.items.map(item => ({
                          id: item.toLowerCase().replace(/\s+/g, '-'),
                          name: item
                        })) : 
                        [{ // Create a default item if no items exist
                          id: subcategory.id.toString() || subcategory.name.toLowerCase().replace(/\s+/g, '-'),
                          name: subcategory.name
                        }]
                    };
                  }) : []
              };
            });
          } catch (err) {
            console.error('Error processing categories via service:', err);
            this.categories = [];
          }
        } else {
          console.error('Categories from service is not an array:', categories);
          this.categories = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories via service:', error);
        this.isLoading = false;
        this.categories = [];
      }
    });
  }

  // New method to position dropdowns based on the nav item position
  private positionDropdown(categoryId: string): void {
    try {
      // Find the nav item and its corresponding dropdown
      const navItem = document.querySelector(`.nav-item[data-category-id="${categoryId}"]`) as HTMLElement;
      const dropdown = document.querySelector(`.dropdown-menu[data-category-id="${categoryId}"]`) as HTMLElement;
      
      if (!navItem || !dropdown) {
        console.error('Could not find nav item or dropdown for positioning');
        return;
      }
      
      // Get the nav item's position and dimensions
      const navRect = navItem.getBoundingClientRect();
      const navItemCenter = navRect.left + (navRect.width / 2);
      const navbarWidth = document.querySelector('.secondary-navbar')?.clientWidth || window.innerWidth;
      
      // Calculate dropdown position
      const dropdownWidth = dropdown.offsetWidth;
      
      // Default position (centered below nav item)
      let leftPos = navItemCenter - (dropdownWidth / 2);
      
      // Check if dropdown would go off the left edge of the screen
      if (leftPos < 10) {
        leftPos = 10; // Add some padding from left edge
      }
      
      // Check if dropdown would go off the right edge of the screen
      if (leftPos + dropdownWidth > navbarWidth - 10) {
        leftPos = navbarWidth - dropdownWidth - 10; // Add some padding from right edge
      }
      
      // Apply the position
      dropdown.style.left = `${leftPos}px`;
      dropdown.style.transform = 'none';
      
      // Ensure the dropdown is visible by forcing a layout calculation
      dropdown.style.display = 'none';
      setTimeout(() => {
        dropdown.style.display = 'block';
        dropdown.getBoundingClientRect(); // Force reflow
      }, 10);
    } catch (err) {
      console.error('Error positioning dropdown:', err);
    }
  }

  // Add this new method to handle link clicks in dropdown menus
  onNavigationLinkClick(): void {
    // Close dropdown and remove overlay
    this.activeCategoryId = null;
    this.showOverlay = false;
    
    // Clear any hover timeouts
    Object.keys(this.hoverTimeouts).forEach(key => {
      clearTimeout(this.hoverTimeouts[key]);
      delete this.hoverTimeouts[key];
    });
    
    // Remove any classes that might be preventing body scroll
    document.body.classList.remove('menu-open');
    document.body.classList.remove('no-scroll');
  }
}