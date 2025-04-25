import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { MenComponent } from './pages/men/men.component';
import { WomenComponent } from './pages/women/women.component';
import { ChildrenComponent } from './pages/children/children.component';
import { WomenEthnicComponent } from './pages/women-ethnic/women-ethnic.component';
import { HomeKitchenComponent } from './pages/home-kitchen/home-kitchen.component';
import { BeautyHealthComponent } from './pages/beauty-health/beauty-health.component';
import { JewelleryAccessoriesComponent } from './pages/jewellery-accessories/jewellery-accessories.component';
import { BagsFootwearComponent } from './pages/bags-footwear/bags-footwear.component';
import { ElectronicsComponent } from './pages/electronics/electronics.component';
import { SportsFitnessComponent } from './pages/sports-fitness/sports-fitness.component';
import { CarComponent } from './pages/car/car.component';
import { CategoryComponent } from './pages/category/category.component';
import { SubcategoryComponent } from './pages/subcategory/subcategory.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { AUTH_ROUTES } from './auth/auth.routes';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { NewArrivalsComponent } from './pages/new-arrivals/new-arrivals.component';
import { DealsComponent } from './pages/deals/deals.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartComponent },
  
  // Feature routes
  { path: 'wishlist', component: WishlistComponent },
  { path: 'new-arrivals', component: NewArrivalsComponent },
  { path: 'deals', component: DealsComponent },
  
  // Auth routes
  { path: 'auth', children: AUTH_ROUTES },
  { path: 'profile', redirectTo: 'auth/profile', pathMatch: 'full' },
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'register', redirectTo: 'auth/register', pathMatch: 'full' },
  
  // Main category pages
  { path: 'men', component: MenComponent }, 
  { path: 'women', component: WomenComponent },
  { path: 'women-western', redirectTo: 'women', pathMatch: 'full' },
  { path: 'children', component: ChildrenComponent },
  { path: 'women-ethnic', component: WomenEthnicComponent },
  { path: 'home-kitchen', component: HomeKitchenComponent },
  { path: 'beauty-health', component: BeautyHealthComponent },
  { path: 'jewellery-accessories', component: JewelleryAccessoriesComponent },
  { path: 'bags-footwear', component: BagsFootwearComponent },
  { path: 'electronics', component: ElectronicsComponent },
  { path: 'sports-fitness', component: SportsFitnessComponent },
  { path: 'car', component: CarComponent },
  
  // Generic category and subcategory pages
  { path: 'category/:category', component: CategoryComponent },
  { path: 'category/:category/:subcategory', component: SubcategoryComponent },
  { path: 'search', component: SearchResultsComponent },
  
  // Detailed subcategory routes for SEO benefits
  { path: 'men/t-shirts', component: SubcategoryComponent, data: { category: 'Men', subcategory: 'T-Shirts' } },
  { path: 'men/shirts', component: SubcategoryComponent, data: { category: 'Men', subcategory: 'Shirts' } },
  { path: 'men/jeans', component: SubcategoryComponent, data: { category: 'Men', subcategory: 'Jeans' } },
  { path: 'men/footwear', component: SubcategoryComponent, data: { category: 'Men', subcategory: 'Footwear' } },
  
  { path: 'women/tops', component: SubcategoryComponent, data: { category: 'Women', subcategory: 'Tops' } },
  { path: 'women/dresses', component: SubcategoryComponent, data: { category: 'Women', subcategory: 'Dresses' } },
  { path: 'women/jeans', component: SubcategoryComponent, data: { category: 'Women', subcategory: 'Jeans' } },
  { path: 'women/footwear', component: SubcategoryComponent, data: { category: 'Women', subcategory: 'Footwear' } },
  
  { path: 'women-ethnic/sarees', component: SubcategoryComponent, data: { category: 'Women Ethnic', subcategory: 'Sarees' } },
  { path: 'women-ethnic/kurtis', component: SubcategoryComponent, data: { category: 'Women Ethnic', subcategory: 'Kurtis' } },
  { path: 'women-ethnic/kurta-sets', component: SubcategoryComponent, data: { category: 'Women Ethnic', subcategory: 'Kurta Sets' } },
  
  { path: 'children/clothing', component: SubcategoryComponent, data: { category: 'Children', subcategory: 'Clothing' } },
  { path: 'children/footwear', component: SubcategoryComponent, data: { category: 'Children', subcategory: 'Footwear' } },
  { path: 'children/toys', component: SubcategoryComponent, data: { category: 'Children', subcategory: 'Toys' } },
  
  { path: 'electronics/smartphones', component: SubcategoryComponent, data: { category: 'Electronics', subcategory: 'Smartphones' } },
  { path: 'electronics/laptops', component: SubcategoryComponent, data: { category: 'Electronics', subcategory: 'Laptops' } },
  { path: 'electronics/audio', component: SubcategoryComponent, data: { category: 'Electronics', subcategory: 'Audio' } },
  
  // Watch routes for direct access
  { path: 'jewellery-accessories/watches', component: SubcategoryComponent, data: { category: 'Jewellery & Accessories', subcategory: 'Watches' } },
  { path: 'jewellery-accessories/watches/mens-watches', component: SubcategoryComponent, data: { category: 'Jewellery & Accessories', subcategory: 'Men\'s Watches' } },
  { path: 'jewellery-accessories/watches/womens-watches', component: SubcategoryComponent, data: { category: 'Jewellery & Accessories', subcategory: 'Women\'s Watches' } },
  { path: 'jewellery-accessories/watches/smart-watches', component: SubcategoryComponent, data: { category: 'Jewellery & Accessories', subcategory: 'Smart Watches' } },
  { path: 'jewellery-accessories/watches/luxury-watches', component: SubcategoryComponent, data: { category: 'Jewellery & Accessories', subcategory: 'Luxury Watches' } },
  { path: 'jewellery-accessories/watches/sports-watches', component: SubcategoryComponent, data: { category: 'Jewellery & Accessories', subcategory: 'Sports Watches' } },
  
  // Catch-all route for 404
  { path: '**', redirectTo: '' } // Fallback route
];