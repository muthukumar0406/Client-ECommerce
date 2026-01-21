import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products', loadComponent: () => import('./features/products/product-list.component').then(m => m.ProductListComponent) },
    { path: 'products/:id', loadComponent: () => import('./features/products/product-detail.component').then(m => m.ProductDetailComponent) },
    { path: 'cart', loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent) },
    { path: 'admin', loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
    { path: '**', redirectTo: '' }
];
