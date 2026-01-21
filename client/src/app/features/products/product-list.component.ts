import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container product-page">
      <aside class="filters glass-panel">
        <h3>Filters</h3>
        <div class="filter-group">
          <h4>Category</h4>
          <ul>
            <li><label><input type="checkbox"> Electronics</label></li>
            <li><label><input type="checkbox"> Fashion</label></li>
            <li><label><input type="checkbox"> Home & Kitchen</label></li>
          </ul>
        </div>
        <div class="filter-group">
          <h4>Price</h4>
          <ul>
            <li><label><input type="radio" name="price"> Under ₹1,000</label></li>
            <li><label><input type="radio" name="price"> ₹1,000 - ₹5,000</label></li>
            <li><label><input type="radio" name="price"> Over ₹5,000</label></li>
          </ul>
        </div>
      </aside>

      <main class="product-results">
        <div class="results-header">
           <h2>New Arrivals</h2>
           <span>{{products.length}} Results</span>
        </div>

        <div class="grid">
          @for (prod of products; track prod.id) {
            <div class="product-card glass-panel" [routerLink]="['/products', prod.id]">
              <div class="image-container">
                <img [src]="prod.imageUrls[0] || 'assets/placeholder.png'" [alt]="prod.name" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
                <div class="card-overlay">
                    <button class="btn-icon" (click)="addToCart($event, prod)" title="Add to Cart">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                    <button class="btn-icon" title="Wishlist" (click)="$event.stopPropagation()">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
              </div>
              <div class="info">
                <div class="category-tag">Category</div>
                <h3 class="name">{{prod.name}}</h3>
                <div class="price-row">
                  <span class="currency">₹</span>
                  <span class="amount">{{prod.price | number}}</span>
                </div>
                
                <div class="actions">
                    <button class="btn btn-primary add-to-cart" (click)="addToCart($event, prod)">
                        Add to Cart
                    </button>
                    <button class="btn btn-outline buy-now" (click)="buyNow($event, prod)">
                        Buy Now
                    </button>
                </div>
              </div>
            </div>
          } @empty {
             <div class="placeholder-grid">
                @for (i of [1,2,3,4,5,6]; track i) {
                  <div class="skeleton-card glass-panel"></div>
                }
             </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: [`
    .product-page { display: flex; gap: 2rem; padding-top: 2rem; padding-bottom: 2rem; flex-direction: column; }
    @media (min-width: 768px) {
        .product-page { flex-direction: row; }
    }

    .filters { 
        width: 100%; 
        padding: 1.5rem; 
        height: fit-content;
    }
    @media (min-width: 768px) {
        .filters { width: 260px; flex-shrink: 0; }
    }

    .filters h3 { margin-bottom: 1.5rem; font-size: 1.25rem; }
    .filter-group { margin-bottom: 1.5rem; }
    .filter-group h4 { font-size: 0.9rem; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
    .filter-group ul { list-style: none; padding: 0; }
    .filter-group li { margin-bottom: 0.5rem; }
    .filter-group label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-main); font-size: 0.95rem; }
    .filter-group input { width: auto; margin: 0; }

    .product-results { flex: 1; }
    
    .results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    .results-header h2 { font-size: 1.5rem; }
    .results-header span { color: var(--text-muted); }

    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }

    .product-card {
      overflow: hidden;
      cursor: pointer;
      border: 1px solid rgba(255,255,255,0.4);
      transition: all 0.4s ease;
      display: flex;
      flex-direction: column;
    }
    
    .product-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        border-color: rgba(99, 102, 241, 0.3);
    }

    .image-container { 
        position: relative;
        background: #fff; 
        padding: 2rem; 
        text-align: center; 
        height: 260px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }
    
    .image-container img { 
        max-width: 100%; 
        max-height: 100%; 
        object-fit: contain; 
        transition: transform 0.5s ease;
    }
    
    .product-card:hover .image-container img {
        transform: scale(1.05);
    }
    
    .card-overlay {
        position: absolute;
        top: 1rem;
        right: -50px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        transition: right 0.3s ease;
    }
    
    .product-card:hover .card-overlay {
        right: 1rem;
    }
    
    .btn-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: white;
        border: none;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        color: var(--text-main);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }
    
    .btn-icon:hover {
        background: var(--primary-color);
        color: white;
    }

    .info { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
    
    .category-tag {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        margin-bottom: 0.5rem;
    }
    
    .name { 
        font-size: 1.1rem; 
        font-weight: 600; 
        margin-bottom: 0.5rem; 
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .price-row { 
        font-size: 1.25rem; 
        font-weight: 700; 
        color: var(--primary-color); 
        margin-bottom: 1rem; 
    }
    
    .actions {
        margin-top: auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
    }
    
    .actions button {
        padding: 0.6rem;
        font-size: 0.85rem;
    }

    .skeleton-card { height: 400px; background: rgba(255,255,255,0.5); animation: pulse 2s infinite; }
    @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (res) => { this.products = res; },
      error: (err) => { console.error('Error fetching products', err); }
    });
  }

  addToCart(event: Event, product: Product) {
    event.stopPropagation();
    this.cartService.addToCart(product);
    // Optional: Show toast
  }

  buyNow(event: Event, product: Product) {
    event.stopPropagation();
    this.cartService.addToCart(product);
    this.router.navigate(['/cart']);
  }
}
