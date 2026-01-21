import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="container detail-page">
      @if (product) {
        <div class="product-layout glass-panel">
          <div class="gallery">
            <div class="main-image">
               <img [src]="product.imageUrls[0] || 'assets/placeholder.png'" 
                    onerror="this.src='https://via.placeholder.com/400'"
                    [alt]="product.name">
            </div>
          </div>
          
          <div class="details">
             <div class="breadcrumb">
                <a routerLink="/products">Shop</a> / <span>{{ product.name }}</span>
             </div>
             
             <h1 class="product-title">{{ product.name }}</h1>
             
             <div class="rating-row">
                <div class="stars">⭐⭐⭐⭐⭐</div>
                <span class="reviews">(128 reviews)</span>
             </div>
             
             <div class="price-section">
                <span class="currency">₹</span>
                <span class="price-value">{{ product.price | number }}</span>
                <span class="tax-note">Inclusive of all taxes</span>
             </div>
             
             <p class="description">
                {{ product.description || 'No description available for this premium product. It features high-quality materials and excellent craftsmanship.' }}
             </p>
             
             <div class="actions-box">
                <button class="btn btn-primary btn-lg" (click)="addToCart()">
                    <i class="fas fa-shopping-bag"></i> Add to Cart
                </button>
                <button class="btn btn-outline btn-lg">
                    Buy Now
                </button>
             </div>
             
             <div class="features-list">
                <div class="feature">
                    <i class="fas fa-truck"></i>
                    <span>Free Delivery</span>
                </div>
                <div class="feature">
                    <i class="fas fa-undo"></i>
                    <span>30 Days Return</span>
                </div>
                <div class="feature">
                    <i class="fas fa-shield-alt"></i>
                    <span>1 Year Warranty</span>
                </div>
             </div>
          </div>
        </div>
      } @else {
         <div class="loading-state">
            <p>Loading Product...</p>
         </div>
      }
    </div>
  `,
    styles: [`
    .detail-page { padding-top: 2rem; padding-bottom: 4rem; }
    
    .product-layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: 3rem;
        padding: 2rem;
    }
    
    @media (min-width: 900px) {
        .product-layout { grid-template-columns: 1fr 1fr; }
    }
    
    .main-image {
        width: 100%;
        height: 400px;
        background: white;
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        box-shadow: inset 0 0 20px rgba(0,0,0,0.05);
    }
    
    .main-image img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
    
    .breadcrumb {
        color: var(--text-muted);
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }
    
    .product-title {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        background: linear-gradient(135deg, var(--text-main), var(--primary-color));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .rating-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
        color: var(--text-muted);
    }
    
    .price-section {
        margin-bottom: 2rem;
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
    }
    
    .currency { font-size: 1.5rem; color: var(--text-main); }
    .price-value { font-size: 3rem; font-weight: 700; color: var(--primary-color); line-height: 1; }
    .tax-note { color: var(--success-color); font-size: 0.9rem; font-weight: 500; }
    
    .description {
        font-size: 1.1rem;
        color: var(--text-muted);
        margin-bottom: 2.5rem;
        line-height: 1.8;
    }
    
    .actions-box {
        display: flex;
        gap: 1.5rem;
        margin-bottom: 3rem;
    }
    
    .btn-lg {
        padding: 1rem 2.5rem;
        font-size: 1.1rem;
    }
    
    .features-list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        padding-top: 2rem;
        border-top: 1px solid rgba(0,0,0,0.1);
    }
    
    .feature {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.5rem;
        color: var(--text-muted);
        font-size: 0.9rem;
    }
    
    .feature i {
        font-size: 1.5rem;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
    product: Product | undefined;

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.productService.getProduct(+id).subscribe(res => {
                this.product = res;
            });
        }
    }

    addToCart() {
        if (this.product) {
            this.cartService.addToCart(this.product);
            // Optional: feedback
        }
    }
}
