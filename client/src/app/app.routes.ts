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
