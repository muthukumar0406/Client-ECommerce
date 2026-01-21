import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="navbar" [class.scrolled]="isScrolled">
      <div class="container navbar-content">
        <!-- Logo -->
        <a routerLink="/" class="logo">
          <span class="logo-icon">✨</span>
          <span class="logo-text">Luxe<span class="highlight">Mart</span></span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/products" routerLinkActive="active">Shop</a>
          <a routerLink="/categories" routerLinkActive="active">Categories</a>
          <a routerLink="/about" routerLinkActive="active">Story</a>
        </nav>

        <!-- Rights: Search & Actions -->
        <div class="nav-actions">
          <div class="search-wrapper">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Search..." />
          </div>

          <a routerLink="/cart" class="action-btn cart-btn">
            <i class="fas fa-shopping-bag"></i>
            <span class="badge" *ngIf="cartCount() > 0">{{ cartCount() }}</span>
          </a>

          <a routerLink="/profile" class="action-btn user-btn">
            <i class="far fa-user"></i>
          </a>
          
          <button class="menu-toggle" (click)="toggleMenu()">
             <i class="fas fa-bars"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="isMenuOpen">
         <a routerLink="/" (click)="toggleMenu()">Home</a>
         <a routerLink="/products" (click)="toggleMenu()">Shop</a>
         <a routerLink="/categories" (click)="toggleMenu()">Categories</a>
         <a routerLink="/cart" (click)="toggleMenu()">Cart</a>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 1rem 0;
      background: rgba(255, 255, 255, 0.05); /* Transparent initially */
      transition: all 0.4s ease;
    }

    .navbar.scrolled {
      padding: 0.8rem 0;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(16px);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    }

    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Logo */
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-main);
    }
    
    .logo-icon {
      font-size: 1.8rem;
    }

    .logo .highlight {
      color: var(--primary-color);
    }

    /* Navigation */
    .nav-links {
      display: none;
      gap: 2.5rem;
    }

    @media (min-width: 768px) {
      .nav-links {
        display: flex;
      }
    }

    .nav-links a {
      font-weight: 500;
      color: var(--text-muted);
      position: relative;
    }

    .nav-links a:hover, .nav-links a.active {
      color: var(--primary-color);
    }

    .nav-links a::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -4px;
      left: 0;
      background-color: var(--primary-color);
      transition: width 0.3s ease;
    }

    .nav-links a:hover::after, .nav-links a.active::after {
      width: 100%;
    }

    /* Actions */
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .search-wrapper {
      display: none;
      align-items: center;
      background: rgba(0,0,0,0.05);
      border-radius: 2rem;
      padding: 0.5rem 1rem;
      transition: all 0.3s ease;
    }
    
    @media (min-width: 900px) {
        .search-wrapper { display: flex; }
    }

    .search-wrapper:focus-within {
      background: white;
      box-shadow: 0 0 0 2px var(--primary-color);
    }

    .search-wrapper input {
      border: none;
      background: transparent;
      padding: 0;
      margin-left: 0.5rem;
      width: 150px;
    }
    
    .search-wrapper input:focus {
        box-shadow: none;
    }

    .action-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      color: var(--text-main);
      box-shadow: var(--shadow-sm);
      position: relative;
      transition: all 0.3s ease;
    }

    .action-btn:hover {
      background: var(--primary-color);
      color: white;
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: var(--accent-color);
      color: white;
      font-size: 0.7rem;
      min-width: 18px;
      height: 18px;
      border-radius: 9px;
      padding: 0 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
    }
    
    .menu-toggle {
        display: block;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-main);
    }
    
    @media (min-width: 768px) {
        .menu-toggle { display: none; }
    }
    
    /* Mobile Menu */
    .mobile-menu {
        position: fixed;
        top: 0;
        right: -100%;
        width: 80%;
        height: 100vh;
        background: white;
        z-index: 1001;
        box-shadow: -5px 0 15px rgba(0,0,0,0.1);
        transition: right 0.3s ease;
        display: flex;
        flex-direction: column;
        padding: 5rem 2rem;
        gap: 2rem;
    }
    
    .mobile-menu.open {
        right: 0;
    }
    
    .mobile-menu a {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--text-main);
    }
  `]
})
export class HeaderComponent {
  isScrolled = false;
  isMenuOpen = false;
  cartCount = this.cartService.totalItems;

  constructor(private cartService: CartService) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
