import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../core/components/header.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, HeaderComponent],
    template: `
    <app-header></app-header>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    <footer class="footer">
      <div class="container">
        <p>&copy; 2026 LuxeMart using Angular & .NET</p>
      </div>
    </footer>
  `,
    styles: [`
    .main-content {
      padding-top: 80px; /* Space for fixed header */
      min-height: calc(100vh - 60px);
    }
    .footer {
      padding: 1rem;
      text-align: center;
      color: var(--text-muted);
      border-top: 1px solid rgba(0,0,0,0.05);
      background: white;
    }
  `]
})
export class MainLayoutComponent { }
