import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-wrapper">
      <header class="admin-navbar glass-panel">
        <div class="logo-area">
            <h3>Admin<span class="highlight">Panel</span></h3>
        </div>
        
        <nav class="admin-tabs">
            <a routerLink="/admin/orders" routerLinkActive="active">
                <i class="fas fa-list-alt"></i> Order Summary
            </a>
            <a routerLink="/admin/items" routerLinkActive="active">
                <i class="fas fa-plus-circle"></i> Add / Manage Items
            </a>
            <a routerLink="/admin/categories" routerLinkActive="active">
                <i class="fas fa-tags"></i> Manage Categories
            </a>
        </nav>
        
        <div class="actions">
            <button class="logout-btn" (click)="logout()">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        </div>
      </header>
      
      <main class="admin-content container">
         <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-wrapper {
      min-height: 100vh;
      background-color: #f8fafc;
    }

    .admin-navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: white;
      margin-bottom: 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    }
    
    @media (max-width: 768px) {
        .admin-navbar {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
        }
        .admin-tabs {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            padding-bottom: 0;
            overflow: visible;
        }
        .admin-tabs a {
            width: 100%;
            justify-content: center;
            border-radius: 8px;
            padding: 0.8rem;
        }
        .actions {
            width: 100%;
            display: flex;
            justify-content: center;
        }
        .admin-content {
            padding: 0 1rem 2rem;
        }
    }
    
    .logo-area h3 { margin: 0; font-size: 1.5rem; color: var(--text-main); }
    .highlight { color: var(--primary-color); }
    
    .admin-tabs {
        display: flex;
        gap: 1rem;
    }
    
    .admin-tabs a {
        padding: 0.8rem 1.5rem;
        border-radius: 30px;
        color: var(--text-muted);
        font-weight: 500;
        transition: all 0.3s;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        white-space: nowrap;
    }
    
    .admin-tabs a:hover {
        background: rgba(99, 102, 241, 0.05);
        color: var(--primary-color);
    }
    
    .admin-tabs a.active {
        background: var(--primary-color);
        color: white;
        box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
    }
    
    .logout-btn {
        background: none;
        border: 1px solid var(--danger-color);
        color: var(--danger-color);
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
        display: flex; align-items: center; gap: 0.5rem;
    }
    .logout-btn:hover { background: var(--danger-color); color: white; }
    
    .admin-content {
        padding-bottom: 2rem;
    }
  `]
})
export class AdminLayoutComponent {
  private router = inject(Router);

  constructor() {
    // Simple auth check
    if (!localStorage.getItem('adminToken')) {
      this.router.navigate(['/admin/login']);
    }
  }

  logout() {
    localStorage.removeItem('adminToken');
    this.router.navigate(['/']); // Go to home
  }
}
