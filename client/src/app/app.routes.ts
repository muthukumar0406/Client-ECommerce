import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { MainLayoutComponent } from './core/components/main-layout.component';
import { AdminLayoutComponent } from './features/admin/admin-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'products', loadComponent: () => import('./features/products/product-list.component').then(m => m.ProductListComponent) },
            { path: 'products/:id', loadComponent: () => import('./features/products/product-detail.component').then(m => m.ProductDetailComponent) },
            { path: 'cart', loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent) },
        ]
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            { path: '', loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) }
        ]
    },
    { path: '**', redirectTo: '' }
];
