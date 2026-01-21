import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <header class="main-header">
      <div class="container header-content">
        <div class="logo" routerLink="/">
          <h1>JK<span>Mart</span></h1>
        </div>
        
        <div class="search-bar">
          <input type="text" placeholder="Search for products, categories...">
          <button class="search-btn">
            <i class="fas fa-search"></i>
          </button>
        </div>
        
        <div class="header-actions">
          <div class="nav-item">
            <span class="label">Hello, Guest</span>
            <span class="value">Account</span>
          </div>
          
          <div class="nav-item" routerLink="/orders">
            <span class="label">Returns</span>
            <span class="value">& Orders</span>
          </div>
          
          <div class="cart-icon" routerLink="/cart">
            <div class="icon-wrapper">
              <i class="fas fa-shopping-cart"></i>
              <span class="badge">0</span>
            </div>
            <span class="cart-label">Cart</span>
          </div>
        </div>
      </div>
    </header>
  `,
    styles: [`
    .main-header {
      background-color: var(--secondary-color);
      color: var(--white);
      padding: 10px 0;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .header-content {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .logo {
      cursor: pointer;
      h1 {
        font-size: 24px;
        font-weight: 800;
        margin-bottom: 0;
        span { color: var(--primary-color); }
      }
    }
    .search-bar {
      flex: 1;
      display: flex;
      input {
        flex: 1;
        padding: 10px 15px;
        border: none;
        border-radius: 4px 0 0 4px;
        outline: none;
      }
      .search-btn {
        background-color: var(--primary-color);
        border: none;
        padding: 0 20px;
        border-radius: 0 4px 4px 0;
        cursor: pointer;
        &:hover { background-color: #f3a847; }
      }
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 25px;
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      .label { font-size: 12px; color: #ccc; }
      .value { font-weight: 700; font-size: 14px; }
    }
    .cart-icon {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      .icon-wrapper {
        position: relative;
        font-size: 24px;
        .badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: var(--primary-color);
          color: var(--accent-color);
          font-size: 12px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 50%;
        }
      }
      .cart-label { font-weight: 700; font-size: 14px; margin-top: 10px; }
    }
  `]
})
export class HeaderComponent { }
