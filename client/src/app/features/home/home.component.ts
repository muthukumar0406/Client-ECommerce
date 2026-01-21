import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="home-container">
      <div class="hero-carousel">
        <div class="carousel-item">
          <img src="https://images-eu.ssl-images-amazon.com/images/G/31/img22/WOC/W4/DesktopHero_3000x1200._CB584556448_.jpg" alt="Hero">
        </div>
      </div>
      
      <div class="container products-grid">
        @for (item of [1,2,3,4]; track item) {
          <div class="category-card card">
            <h3>Featured Category {{item}}</h3>
            <div class="category-images">
               <img src="https://m.media-amazon.com/images/I/41-q-8hWnHL._AC_SY200_.jpg" alt="cat">
            </div>
            <a href="#" class="see-more">See more</a>
          </div>
        }
      </div>

      <div class="container section">
        <h2 class="section-title">Best Sellers in Electronics</h2>
        <div class="product-scroller">
           @for (item of [1,2,3,4,5,6]; track item) {
             <div class="product-item card">
                <img src="https://m.media-amazon.com/images/I/41-q-8hWnHL._AC_SY200_.jpg" alt="prod">
                <p class="name">Product Name {{item}}</p>
                <div class="rating">⭐⭐⭐⭐⭐ 450</div>
                <p class="price">₹14,999</p>
             </div>
           }
        </div>
      </div>
    </div>
  `,
    styles: [`
    .hero-carousel {
      width: 100%;
      height: 400px;
      overflow: hidden;
      margin-bottom: -150px;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0));
      img { width: 100%; object-fit: cover; }
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      position: relative;
      z-index: 10;
    }
    .category-card {
      h3 { font-size: 20px; }
      .category-images { margin: 15px 0; }
      .see-more { color: #007185; text-decoration: none; font-size: 14px; }
    }
    .section { margin-top: 40px; }
    .section-title { font-size: 22px; font-weight: 700; margin-bottom: 20px; }
    .product-scroller {
      display: flex;
      gap: 15px;
      overflow-x: auto;
      padding: 10px 0;
      &::-webkit-scrollbar { height: 8px; }
      &::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
    }
    .product-item {
      min-width: 200px;
      text-align: center;
      .name { font-size: 14px; margin: 10px 0 5px; color: #007185; }
      .price { font-size: 18px; font-weight: 700; }
      .rating { font-size: 12px; color: #ffa41c; }
    }
  `]
})
export class HomeComponent { }
