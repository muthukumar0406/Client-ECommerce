import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../core/services/product.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="container product-page">
      <aside class="filters">
        <h3>Filters</h3>
        <div class="filter-group">
          <h4>Category</h4>
          <ul>
            <li><input type="checkbox"> Electronics</li>
            <li><input type="checkbox"> Fashion</li>
            <li><input type="checkbox"> Home & Kitchen</li>
          </ul>
        </div>
        <div class="filter-group">
          <h4>Price</h4>
          <ul>
            <li>Under ₹1,000</li>
            <li>₹1,000 - ₹5,000</li>
            <li>Over ₹5,000</li>
          </ul>
        </div>
      </aside>

      <main class="product-results">
        <h2>Results</h2>
        <div class="grid">
          @for (prod of products; track prod.id) {
            <div class="product-card card" [routerLink]="['/products', prod.id]">
              <div class="image-container">
                <img [src]="prod.imageUrls[0] || 'https://via.placeholder.com/200'" alt="product">
              </div>
              <div class="info">
                <h3 class="name">{{prod.name}}</h3>
                <div class="rating">⭐⭐⭐⭐☆ 1,234</div>
                <div class="price-row">
                  <span class="currency">₹</span>
                  <span class="amount">{{prod.price | number}}</span>
                </div>
                <p class="delivery">Get it by <b>Tomorrow, Jan 22</b></p>
                <button class="btn btn-primary add-to-cart" (click)="$event.stopPropagation()">Add to Cart</button>
              </div>
            </div>
          } @empty {
             <div class="placeholder-grid">
                @for (i of [1,2,3,4,5,6,7,8]; track i) {
                  <div class="skeleton-card"></div>
                }
             </div>
          }
        </div>
      </main>
    </div>
  `,
    styles: [`
    .product-page { display: flex; gap: 30px; padding-top: 20px; }
    .filters { width: 250px; flex-shrink: 0; }
    .filter-group { margin-bottom: 20px; h4 { font-size: 16px; margin-bottom: 10px; } ul { list-style: none; padding: 0; li { margin-bottom: 5px; cursor: pointer; &:hover { color: var(--primary-color); } } } }
    .product-results { flex: 1; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
    .product-card {
      display: flex;
      flex-direction: column;
      padding: 0;
      overflow: hidden;
      cursor: pointer;
      .image-container { background: #f8f8f8; padding: 20px; text-align: center; img { max-width: 100%; height: 200px; object-fit: contain; } }
      .info { padding: 15px; }
      .name { font-size: 16px; font-weight: 500; color: #007185; margin-bottom: 5px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
      .price-row { font-size: 22px; font-weight: 700; margin: 10px 0; }
      .delivery { font-size: 13px; color: #565959; }
      .add-to-cart { width: 100%; margin-top: 15px; }
    }
    .skeleton-card { height: 350px; background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%); background-size: 200% 100%; animation: loading 1.5s infinite; border-radius: 8px; }
    @keyframes loading { from { background-position: 200% 0; } to { background-position: -200% 0; } }
  `]
})
export class ProductListComponent implements OnInit {
    products: Product[] = [];

    constructor(private productService: ProductService) { }

    ngOnInit() {
        this.productService.getProducts().subscribe(res => {
            this.products = res;
        });
    }
}
