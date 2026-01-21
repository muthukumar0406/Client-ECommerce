import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <footer class="main-footer">
      <div class="container footer-content">
        <div class="footer-section">
          <h3>Get to Know Us</h3>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
            <li>Press Releases</li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Connect with Us</h3>
          <ul>
            <li>Facebook</li>
            <li>Twitter</li>
            <li>Instagram</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 JK Mart. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 200px);
      padding: 20px 0;
    }
    .main-footer {
      background-color: var(--secondary-color);
      color: var(--white);
      padding: 40px 0 20px;
      margin-top: 50px;
    }
    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 40px;
      margin-bottom: 40px;
    }
    .footer-section h3 { font-size: 18px; margin-bottom: 15px; }
    .footer-section ul { list-style: none; padding: 0; }
    .footer-section ul li { margin-bottom: 10px; color: #ccc; cursor: pointer; &:hover { text-decoration: underline; } }
    .footer-bottom {
      border-top: 1px solid #3a4553;
      padding-top: 20px;
      text-align: center;
      p { font-size: 14px; color: #ccc; }
    }
  `]
})
export class AppComponent { }
