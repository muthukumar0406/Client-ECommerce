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
        <!-- Logo + Site Name -->
        <a routerLink="/" class="logo">
          <!-- Small logo placeholder or text -->
          <span class="logo-text">MK <span class="highlight">Demo</span></span>
        </a>

        <!-- Right: Admin Login -->
        <div class="nav-actions">
           <a routerLink="/admin" class="admin-login-btn">
             Admin Login
           </a>
        </div>
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
      background: white;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      transition: all 0.3s ease;
    }

    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Logo */
    .logo {
      text-decoration: none;
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .highlight {
      color: var(--primary-color);
    }

    /* Admin Button */
    .admin-login-btn {
      font-weight: 600;
      color: var(--primary-color);
      border: 2px solid var(--primary-color);
      padding: 0.5rem 1.2rem;
      border-radius: 2rem;
      transition: all 0.3s;
      text-decoration: none;
    }
    
    .admin-login-btn:hover {
      background: var(--primary-color);
      color: white;
    }
  `]
})
export class HeaderComponent {
  isScrolled = false;

  constructor(private cartService: CartService) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }
}
