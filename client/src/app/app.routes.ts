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
            // Removed product list page as per request
            { path: 'products/:id', loadComponent: () => import('./features/products/product-detail.component').then(m => m.ProductDetailComponent) },
            { path: 'cart', loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent) },
            { path: 'payment/:id', loadComponent: () => import('./features/payment/payment.component').then(m => m.PaymentComponent) },
        ]
    },
    { path: 'admin/login', loadComponent: () => import('./features/admin/admin-login.component').then(m => m.AdminLoginComponent) },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            { path: '', redirectTo: 'orders', pathMatch: 'full' },
            { path: 'orders', loadComponent: () => import('./features/admin/admin-orders.component').then(m => m.AdminOrdersComponent) },
            { path: 'items', loadComponent: () => import('./features/admin/admin-items.component').then(m => m.AdminItemsComponent) },
            { path: 'categories', loadComponent: () => import('./features/admin/admin-categories.component').then(m => m.AdminCategoriesComponent) }
        ]
    },
    { path: '**', redirectTo: '' }
];
