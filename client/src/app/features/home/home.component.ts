import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService, Product } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { CategoryService, Category } from '../../core/services/category.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="home-container">
    
      <!-- 2. Company Info Section -->
      <section class="company-header container">
        <div class="company-card glass-panel animate-slide-up">
           <div class="company-main">
              <div class="company-logo">
                 <img src="assets/Logo.jpeg" alt="AGS Super Market Logo" class="brand-img">
              </div>
              <div class="company-title">
                  <h1>AGS Super Market</h1>
                  <p class="category">Grocery & Vegetables</p>
                  <div class="gstin-row">
                     <span class="gstin-badge">GSTIN: 33ACTPH1769C1ZM</span>
                  </div>
              </div>
           </div>
           
           <div class="company-details">
              <div class="detail-row">
                 <div class="detail-item">
                    <div class="icon-box"><i class="fas fa-phone-alt"></i></div>
                    <div class="detail-content">
                       <span class="label">Call to Order</span>
                       <div class="contact-links">
                          <a href="tel:9514331000" class="touch-link">95143 31000</a>
                          <span class="separator">|</span>
                          <a href="tel:9514531000" class="touch-link">95145 31000</a>
                       </div>
                    </div>
                 </div>
                 <div class="detail-item">
                    <div class="icon-box"><i class="fas fa-envelope"></i></div>
                    <div class="detail-content">
                       <span class="label">Email Address</span>
                       <a href="mailto:haridass1000&#64;gmail.com" class="touch-link">haridass1000&#64;gmail.com</a>
                    </div>
                 </div>
              </div>
              <div class="detail-item address">
                 <div class="icon-box"><i class="fas fa-map-marker-alt"></i></div>
                 <div class="detail-content">
                    <span class="label">Store Location</span>
                    <p class="address-text">6/6, Santham Colony, Anna Nagar West Extension, Chennai – 600101</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <!-- 3. Search Bar -->
      <section class="search-section container">
         <div class="search-bar glass-panel">
            <i class="fas fa-search search-icon"></i>
            <input #searchInput
                   type="text" 
                   placeholder="Search items..." 
                   [value]="searchQuery()"
                   (input)="searchQuery.set(searchInput.value)">
         </div>
      </section>

      <!-- 4. Category Tabs -->
      <section class="category-tabs container">
         <div class="tabs-scroll">
            <button class="tab-btn" 
                    [class.active]="selectedCategory() === 'All'" 
                    (click)="selectCategory('All')">All</button>
            @for (cat of categories(); track cat.id) {
                <button class="tab-btn" 
                        [class.active]="selectedCategory() === cat.name" 
                        (click)="selectCategory(cat.name)">{{cat.name}}</button>
            }
         </div>
      </section>

      <!-- 5. Product List -->
      <section class="product-list container">
         <div class="grid">
            @for (prod of filteredProducts(); track prod.id) {
                <div class="product-card glass-panel">
                   <div class="img-box">
                       <img [src]="prod.imageUrls[0] || 'assets/placeholder.png'" [alt]="prod.name" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
                   </div>
                   <div class="details">
                       <div class="header-info">
                           <h3>{{prod.name}}</h3>
                           <div class="quantity-badge" *ngIf="prod.quantityUnit">
                              {{prod.quantityUnit}}
                           </div>
                       </div>
                       
                       <div class="price-section">
                           <div class="price-block">
                               <span class="final-price">₹{{prod.discountPrice || prod.price}}</span>
                               <span class="original-price" *ngIf="prod.discountPrice && prod.price > prod.discountPrice">₹{{prod.price}}</span>
                           </div>
                       </div>
                       
                       <!-- Add Button / Quantity Controls -->
                       <div class="actions">
                           @if (prod.stockQuantity <= 0) {
                               <button class="add-btn out-of-stock" disabled>Out of Stock</button>
                           } @else if (getQuantity(prod.id) === 0) {
                               <button class="add-btn" (click)="increment(prod)">ADD TO CART</button>
                           } @else {
                               <div class="qty-control">
                                   <button (click)="decrement(prod)" class="qty-btn">-</button>
                                   <span class="qty-val">{{getQuantity(prod.id)}}</span>
                                   <button (click)="increment(prod)" class="qty-btn">+</button>
                               </div>
                           }
                       </div>
                   </div>
                </div>
            } @empty {
                <div class="empty-state">
                   <p>No products found matching your criteria.</p>
                </div>
            }
         </div>
      </section>

      <!-- 7. Bottom Cart Bar (Sticky) -->
      @if (cartTotalItems() > 0) {
          <div class="cart-bar">
             <div class="cart-info">
                <span class="count">{{cartTotalItems()}} Items</span>
                <span class="divider">|</span>
                <span class="total">₹{{cartTotalPrice() | number}}</span>
             </div>
             <button class="view-cart-btn" routerLink="/cart">
                View Cart <i class="fas fa-chevron-right"></i>
             </button>
          </div>
      }
    </div>
  `,
  styles: [`
    .home-container { padding-bottom: 80px; } /* Space for cart bar */
    .glass-panel {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        border: 1px solid rgba(0,0,0,0.05);
    }
    
    /* Company Header Styles */
    .company-header { margin-top: 1.5rem; padding: 0 1rem; }
    .company-card {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        border-left: 6px solid #2e7d32;
        text-align: center;
        align-items: center;
    }
    
    @media (min-width: 992px) {
        .company-header { padding: 0; }
        .company-card { 
            padding: 2.5rem;
            flex-direction: row; 
            justify-content: space-between; 
            align-items: stretch;
            text-align: left;
        }
        .company-main { border-right: 1px solid #e2e8f0; padding-right: 2.5rem; flex: 1; }
        .company-details { padding-left: 2.5rem; flex: 1.5; }
    }
    
    .company-main { 
        display: flex; 
        flex-direction: column;
        gap: 1.5rem; 
        align-items: center; 
    }
    
    @media (min-width: 992px) {
        .company-main { flex-direction: row; }
    }

    .company-logo {
        width: 90px; height: 90px;
        flex-shrink: 0;
        border-radius: 16px;
        overflow: hidden;
        background: white;
        box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        padding: 5px;
    }
    @media (min-width: 992px) { .company-logo { width: 110px; height: 110px; } }
    .brand-img { width: 100%; height: 100%; object-fit: contain; }
    
    .company-title h1 { margin: 0; font-size: 1.6rem; color: #1b5e20; letter-spacing: -0.5px; line-height: 1.1; }
    .company-title .category { margin: 0.4rem 0 0.8rem; color: #64748b; font-weight: 500; font-size: 1rem; }
    
    @media (min-width: 992px) {
        .company-title h1 { font-size: 2.2rem; }
        .company-title .category { font-size: 1.2rem; }
    }

    .gstin-row { display: flex; justify-content: center; }
    @media (min-width: 992px) { .gstin-row { justify-content: flex-start; } }
    .gstin-badge { 
        background: #e8f5e9;
        color: #2e7d32;
        padding: 0.4rem 1rem;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 700;
        letter-spacing: 0.5px;
        display: inline-block;
    }
    
    .company-details { display: flex; flex-direction: column; gap: 1.8rem; justify-content: center; width: 100%; }
    .detail-row { display: grid; grid-template-columns: 1fr; gap: 1.8rem; width: 100%; }
    
    @media (min-width: 768px) { .detail-row { grid-template-columns: 1fr 1fr; } }
    
    .detail-item { 
        display: flex; 
        flex-direction: column;
        gap: 1rem; 
        align-items: center; 
    }
    
    @media (min-width: 992px) {
        .detail-item { flex-direction: row; align-items: flex-start; text-align: left; }
    }

    .icon-box { 
        width: 44px; height: 44px;
        background: #f1f8e9;
        color: #2e7d32;
        border-radius: 12px;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
        font-size: 1.1rem;
        transition: transform 0.2s;
    }
    .detail-item:hover .icon-box { transform: scale(1.1); }

    .detail-content { display: flex; flex-direction: column; align-items: center; width: 100%; }
    
    @media (min-width: 992px) {
        .detail-content { align-items: flex-start; }
    }

    .detail-content .label { 
        font-size: 0.7rem; 
        text-transform: uppercase; 
        color: #94a3b8; 
        font-weight: 800; 
        margin-bottom: 0.4rem; 
        letter-spacing: 1px;
    }
    
    .touch-link { 
        font-size: 1.05rem; 
        font-weight: 700; 
        color: #334155; 
        text-decoration: none; 
        padding: 0.5rem 0.2rem;
        transition: color 0.2s;
        display: inline-block;
    }
    .touch-link:active { background: rgba(46, 125, 50, 0.05); border-radius: 4px; }
    .touch-link:hover { color: #2e7d32; }

    .contact-links { display: flex; align-items: center; gap: 0.6rem; justify-content: center; flex-wrap: wrap; }
    @media (min-width: 992px) { .contact-links { justify-content: flex-start; } }
    
    .separator { color: #cbd5e1; font-weight: 300; }
    
    .address-text { 
        margin: 0; 
        padding-top: 0.2rem;
        font-size: 0.95rem; 
        font-weight: 600; 
        color: #475569; 
        line-height: 1.5; 
        max-width: 320px;
    }
    @media (min-width: 992px) { .address-text { max-width: none; } }

    /* Search Bar */
    .search-section { margin-top: 1.5rem; }
    .search-bar {
        display: flex;
        align-items: center;
        padding: 0.8rem 1.2rem;
        gap: 1rem;
    }
    .search-input { width: 100%; border: none; outline: none; font-size: 1rem; }
    .search-bar input { border: none; width: 100%; font-size: 1rem; outline: none; }
    .search-icon { color: var(--text-muted); }

    /* Category Tabs */
    .category-tabs { margin-top: 1.5rem; overflow: hidden; }
    .tabs-scroll {
        display: flex;
        gap: 1rem;
        overflow-x: auto;
        padding-bottom: 0.5rem;
        scrollbar-width: none;
    }
    .tabs-scroll::-webkit-scrollbar { display: none; }
    
    .tab-btn {
        padding: 0.6rem 1.5rem;
        border: none;
        background: white;
        border-radius: 20px;
        font-weight: 500;
        color: var(--text-muted);
        cursor: pointer;
        white-space: nowrap;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        transition: all 0.3s;
    }
    .tab-btn.active {
        background: var(--primary-color);
        color: white;
        transform: scale(1.05);
    }
    
    /* Product List */
    .product-list { margin-top: 2rem; }
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 1rem;
    }
    @media (min-width: 600px) {
        .grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; }
    }
    
    .product-card {
        overflow: hidden;
        padding: 0.8rem;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    .product-card:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); }

    .img-box {
        height: 120px;
        display: flex; align-items: center; justify-content: center;
        background: #f8fafc;
        border-radius: 8px;
        padding: 0.5rem;
    }
    .img-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
    
    .details { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
    
    .header-info { display: flex; flex-direction: column; gap: 0.25rem; }
    .header-info h3 { font-size: 0.95rem; margin: 0; font-weight: 600; color: #334155; line-height: 1.2; min-height: 2.4rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    
    .quantity-badge { font-size: 0.75rem; color: #64748b; font-weight: 500; background: #f1f5f9; padding: 0.1rem 0.5rem; border-radius: 4px; align-self: flex-start; }
    
    .price-section { margin-top: 0.25rem; }
    .price-block { display: flex; gap: 0.5rem; align-items: baseline; }
    .final-price { font-weight: 700; font-size: 1.1rem; color: #0f172a; }
    .original-price { text-decoration: line-through; color: #94a3b8; font-size: 0.85rem; }
    
    .actions { margin-top: auto; padding-top: 0.5rem; }
    .add-btn {
        width: 100%;
        padding: 0.6rem;
        border: none;
        background: white;
        border: 1px solid var(--primary-color);
        color: var(--primary-color);
        border-radius: 8px;
        font-weight: 700;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;
    }
    .add-btn:hover { background: var(--primary-color); color: white; }
    .add-btn.out-of-stock { background: #f1f5f9; border-color: #e2e8f0; color: #94a3b8; cursor: not-allowed; }
    
    .qty-control {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--primary-color);
        color: white;
        border-radius: 8px;
        padding: 0.2rem;
    }
    .qty-btn {
        background: none; border: none; color: white;
        width: 30px; height: 30px; font-weight: bold; font-size: 1.2rem; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
    }
    .qty-val { font-weight: 700; font-size: 0.9rem; }
    
    /* Sticky Cart Bar */
    .cart-bar {
        position: fixed;
        bottom: 0; left: 0; right: 0;
        background: white;
        padding: 1rem 1.5rem;
        display: flex; justify-content: space-between; align-items: center;
        box-shadow: 0 -5px 20px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideUp 0.3s ease;
    }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    
    .cart-info { display: flex; align-items: center; gap: 0.8rem; font-weight: 600; font-size: 1.1rem; }
    .view-cart-btn {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 30px;
        font-weight: 600;
        display: flex; align-items: center; gap: 0.5rem;
        cursor: pointer;
    }
  `]
})
export class HomeComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);

  selectedCategory = signal<string>('All');
  searchQuery = signal<string>('');

  cartTotalItems = this.cartService.totalItems;
  cartTotalPrice = this.cartService.totalPrice;

  filteredProducts = computed(() => {
    let items = this.products();
    const cat = this.selectedCategory();
    const query = this.searchQuery().toLowerCase();

    if (cat !== 'All') {
      const catObj = this.categories().find(c => c.name === cat);
      if (catObj) {
        items = items.filter(p => p.categoryId === catObj.id);
      }
    }

    if (query) {
      items = items.filter(p => (p.name || '').toLowerCase().includes(query));
    }

    return items;
  });

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.productService.getProducts().subscribe(res => this.products.set(res));
    this.categoryService.getCategories().subscribe(res => {
      // We should ensure we have 'Honey', 'Nuts', 'Milk' if they aren't in DB yet?
      // The user said "Categories auto-appear".
      this.categories.set(res);
    });

    // Mock data if API is empty for visual check?
    // Let's rely on API.
  }

  selectCategory(cat: string) {
    this.selectedCategory.set(cat);
  }

  filterProducts() {
    // Triggered by ngModelChange, handled by computed
  }

  getQuantity(productId: number): number {
    const item = this.cartService.cartItems().find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  }

  increment(product: Product) {
    this.cartService.addToCart(product);
  }

  decrement(product: Product) {
    const current = this.getQuantity(product.id);
    if (current > 0) {
      this.cartService.updateQuantity(product.id, current - 1);
    }
  }
}
