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
      <section class="company-info container">
        <div class="info-card glass-panel">
           <div class="brand-info">
              <div class="brand-logo">MK</div>
              <div class="brand-text">
                  <h2>About MK Demo</h2>
                  <p>Premium quality honey, nuts & dairy products</p>
              </div>
           </div>
           <div class="contact-info">
              <div class="contact-item"><i class="fas fa-phone-alt"></i> <a href="tel:8925170985" style="color: inherit; text-decoration: none;">8925170985</a></div>
              <div class="contact-item"><i class="fas fa-envelope"></i> <a href="mailto:muthukumarbsc0406&#64;gmail.com" style="color: inherit; text-decoration: none;">muthukumarbsc0406&#64;gmail.com</a></div>
              <div class="contact-item"><i class="fas fa-map-marker-alt"></i> 123, Main Street, City</div>
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
                      <h3>{{prod.name}}</h3>
                      <div class="price-block">
                          <span class="original-price" *ngIf="prod.discountPrice && prod.price > prod.discountPrice">₹{{prod.price}}</span>
                          <span class="final-price">₹{{prod.discountPrice || prod.price}}</span>
                      </div>
                      <div class="quantity-unit" *ngIf="prod.quantityUnit">
                         <small>{{prod.quantityUnit}}</small>
                      </div>
                      
                      <!-- Add Button / Quantity Controls -->
                      <div class="actions">
                          @if (prod.stockQuantity <= 0) {
                              <button class="add-btn" disabled style="opacity: 0.5; cursor: not-allowed; background: #eee; border-color: #ddd; color: #999;">Out of Stock</button>
                          } @else if (getQuantity(prod.id) === 0) {
                              <button class="add-btn" (click)="increment(prod)">ADD</button>
                          } @else {
                              <div class="qty-control">
                                  <button (click)="decrement(prod)">-</button>
                                  <span>{{getQuantity(prod.id)}}</span>
                                  <button (click)="increment(prod)">+</button>
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
    
    /* Company Info */
    .company-info { margin-top: 1rem; }
    .info-card {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    @media (min-width: 768px) {
        .info-card { flex-direction: row; justify-content: space-between; align-items: center; }
    }
    
    .brand-info { display: flex; gap: 1rem; align-items: center; }
    .brand-logo {
        width: 60px; height: 60px;
        background: var(--primary-color);
        color: white;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-weight: bold; font-size: 1.2rem;
    }
    .brand-text h2 { margin: 0; font-size: 1.2rem; }
    .brand-text p { margin: 0; color: var(--text-muted); font-size: 0.9rem; }
    
    .contact-info { display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem; color: var(--text-muted); }
    .contact-item i { width: 20px; color: var(--primary-color); }

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
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .img-box {
        height: 140px;
        display: flex; align-items: center; justify-content: center;
    }
    .img-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
    
    .details h3 { font-size: 1rem; margin: 0; line-height: 1.3; height: 2.6rem; overflow: hidden; }
    .price-block { display: flex; gap: 0.5rem; align-items: baseline; margin-top: 0.5rem; }
    .original-price { text-decoration: line-through; color: var(--text-muted); font-size: 0.9rem; }
    .final-price { font-weight: bold; font-size: 1.1rem; color: var(--primary-color); }
    .quantity-unit { margin-top: -0.2rem; color: var(--text-muted); font-weight: 500; }
    
    .actions { margin-top: auto; }
    .add-btn {
        width: 100%;
        padding: 0.6rem;
        border: none;
        background: white;
        border: 1px solid var(--primary-color);
        color: var(--primary-color);
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }
    .add-btn:hover { background: var(--primary-color); color: white; }
    
    .qty-control {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--primary-color);
        color: white;
        border-radius: 8px;
        padding: 0.3rem;
    }
    .qty-control button {
        background: none; border: none; color: white;
        width: 30px; height: 30px; font-weight: bold; font-size: 1.2rem; cursor: pointer;
    }
    
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
