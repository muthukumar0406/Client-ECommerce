import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <header class="hero glass-panel">
        <div class="hero-content">
            <h1>Experience the Future of <span class="highlight">Shopping</span></h1>
            <p>Discover premium collections, curated just for you. Quality meets innovation in every product.</p>
            <div class="hero-actions">
                <a routerLink="/products" class="btn btn-primary btn-lg">Shop Now</a>
                <a routerLink="/about" class="btn btn-outline btn-lg">Learn More</a>
            </div>
        </div>
        <div class="hero-visual">
            <div class="floating-card c1"></div>
            <div class="floating-card c2"></div>
            <div class="floating-card c3"></div>
        </div>
      </header>
      
      <!-- Categories -->
      <section class="container section">
        <h2 class="section-title">Explore Categories</h2>
        <div class="grid categories-grid">
          <div class="category-card glass-panel" routerLink="/products">
            <div class="icon-box"><i class="fas fa-mobile-alt"></i></div>
            <h3>Electronics</h3>
            <p>Latest gadgets & tech</p>
          </div>
          <div class="category-card glass-panel" routerLink="/products">
            <div class="icon-box"><i class="fas fa-tshirt"></i></div>
            <h3>Fashion</h3>
            <p>Trendsetting styles</p>
          </div>
          <div class="category-card glass-panel" routerLink="/products">
            <div class="icon-box"><i class="fas fa-couch"></i></div>
            <h3>Home & Living</h3>
            <p>Elevate your space</p>
          </div>
          <div class="category-card glass-panel" routerLink="/products">
            <div class="icon-box"><i class="fas fa-gem"></i></div>
            <h3>Luxury</h3>
            <p>Exquisite finds</p>
          </div>
        </div>
      </section>

      <!-- Featured -->
      <section class="container section">
        <div class="section-header">
            <h2 class="section-title">Trending Now</h2>
            <a routerLink="/products" class="see-all">View All <i class="fas fa-arrow-right"></i></a>
        </div>
        
        <div class="product-scroller">
           @for (item of [1,2,3,4,5]; track item) {
             <div class="product-item glass-panel" routerLink="/products">
                <div class="prod-image"></div>
                <div class="prod-info">
                    <p class="name">Premium Item {{item}}</p>
                    <p class="price">₹{{ 1000 * item | number }}</p>
                </div>
             </div>
           }
        </div>
      </section>
      
      <!-- Newsletter -->
      <section class="container section newsletter">
        <div class="glass-panel newsletter-box">
            <h2>Join Our Exclusive Club</h2>
            <p>Get early access to new drops and special offers.</p>
            <div class="input-group">
                <input type="email" placeholder="Enter your email">
                <button class="btn btn-primary">Subscribe</button>
            </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container { padding-bottom: 4rem; }
    
    /* Hero */
    .hero {
        margin: 2rem auto;
        max-width: 1280px;
        min-height: 500px;
        padding: 4rem 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
    }
    
    .hero-content {
        max-width: 600px;
        z-index: 2;
    }
    
    .hero h1 {
        font-size: 3.5rem;
        font-weight: 800;
        line-height: 1.1;
        margin-bottom: 1.5rem;
        background: linear-gradient(135deg, var(--text-main), var(--primary-color));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .highlight { color: var(--primary-color); }
    
    .hero p { font-size: 1.25rem; margin-bottom: 2.5rem; max-width: 450px; }
    
    .hero-actions { display: flex; gap: 1rem; }
    .btn-lg { padding: 1rem 2rem; font-size: 1.1rem; }
    
    .hero-visual {
        position: relative;
        width: 500px;
        height: 500px;
        display: none;
    }
    @media (min-width: 900px) { .hero-visual { display: block; } }
    
    .floating-card {
        position: absolute;
        background: rgba(255,255,255,0.4);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.6);
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    .c1 { width: 200px; height: 260px; top: 50px; left: 100px; z-index: 3; background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2)); }
    .c2 { width: 180px; height: 180px; bottom: 80px; left: 20px; z-index: 2; animation: float 6s ease-in-out infinite; }
    .c3 { width: 150px; height: 150px; top: 20px; right: 50px; z-index: 1; animation: float 8s ease-in-out infinite reverse; }
    
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }

    /* Sections */
    .section { margin-top: 5rem; }
    .section-title { font-size: 2rem; margin-bottom: 2rem; font-weight: 700; }
    
    .categories-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
    
    .category-card {
        padding: 2rem;
        text-align: center;
        transition: transform 0.3s;
        cursor: pointer;
    }
    .category-card:hover { transform: translateY(-10px); background: rgba(255,255,255,0.9); }
    
    .icon-box {
        width: 60px;
        height: 60px;
        background: rgba(99, 102, 241, 0.1);
        color: var(--primary-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        margin: 0 auto 1rem;
    }
    
    /* Scroller */
    .section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
    .see-all { font-weight: 600; color: var(--primary-color); }
    
    .product-scroller {
        display: flex;
        gap: 2rem;
        overflow-x: auto;
        padding: 1rem 0;
        scroll-behavior: smooth;
    }
    
    .product-item {
        min-width: 250px;
        padding: 1rem;
        cursor: pointer;
        transition: transform 0.3s;
    }
    .product-item:hover { transform: translateY(-5px); }
    
    .prod-image { height: 200px; background: rgba(0,0,0,0.03); border-radius: var(--radius-md); margin-bottom: 1rem; }
    .prod-info .name { font-weight: 600; margin-bottom: 0.5rem; }
    .prod-info .price { color: var(--primary-color); font-weight: 700; font-size: 1.1rem; }

    /* Newsletter */
    .newsletter-box {
        text-align: center;
        padding: 4rem 2rem;
        background: linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4));
    }
    .input-group {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
        max-width: 500px;
        margin: 2rem auto 0;
        flex-wrap: wrap;
    }
    .input-group input { flex: 1; min-width: 200px; }
  `]
})
export class HomeComponent { }
