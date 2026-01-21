import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="admin-wrapper">
      <aside class="sidebar" [class.collapsed]="collapsed">
        <div class="sidebar-header">
          <h3>Admin<span class="dot">.</span></h3>
          <button class="collapse-btn" (click)="toggleSidebar()">
             <i class="fas fa-bars"></i>
          </button>
        </div>
        
        <nav class="sidebar-nav">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <i class="fas fa-th-large"></i> <span>Dashboard</span>
          </a>
          <a routerLink="/admin/products" routerLinkActive="active">
            <i class="fas fa-box"></i> <span>Products</span>
          </a>
          <a routerLink="/admin/orders" routerLinkActive="active">
            <i class="fas fa-shopping-cart"></i> <span>Orders</span>
          </a>
          <a routerLink="/admin/users" routerLinkActive="active">
            <i class="fas fa-users"></i> <span>Users</span>
          </a>
          <a routerLink="/admin/settings" routerLinkActive="active">
            <i class="fas fa-cog"></i> <span>Settings</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <a routerLink="/" class="logout-btn">
             <i class="fas fa-sign-out-alt"></i> <span>Exit</span>
          </a>
        </div>
      </aside>

      <main class="admin-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
    styles: [`
    .admin-wrapper {
      display: flex;
      min-height: 100vh;
      background-color: #f1f5f9;
    }

    .sidebar {
      width: 260px;
      background: white;
      border-right: 1px solid rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      position: sticky;
      top: 0;
      height: 100vh;
      z-index: 100;
    }

    .sidebar.collapsed {
      width: 80px;
    }
    
    .sidebar.collapsed span:not(.dot) {
      display: none;
    }
    
    .sidebar.collapsed .sidebar-header h3 {
      display: none;
    }
    
    .sidebar-header {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 80px;
    }
    
    .sidebar-header h3 {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-main);
      margin: 0;
    }
    
    .dot { color: var(--primary-color); }

    .collapse-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: var(--text-muted);
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      color: var(--text-muted);
      font-weight: 500;
      transition: all 0.2s;
    }

    .sidebar-nav a:hover {
      background-color: rgba(99, 102, 241, 0.05);
      color: var(--primary-color);
    }
    
    .sidebar-nav a.active {
      background-color: rgba(99, 102, 241, 0.1);
      color: var(--primary-color);
      border-right: 3px solid var(--primary-color);
    }
    
    .sidebar-nav a i {
      width: 20px;
      text-align: center;
      font-size: 1.1rem;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid rgba(0,0,0,0.05);
    }
    
    .logout-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.8rem;
      color: var(--danger-color);
      font-weight: 600;
      cursor: pointer;
    }

    .admin-content {
      flex: 1;
      padding: 2rem;
      background: var(--bg-color);
      overflow-y: auto;
    }
  `]
})
export class AdminLayoutComponent {
    collapsed = false;

    toggleSidebar() {
        this.collapsed = !this.collapsed;
    }
}
