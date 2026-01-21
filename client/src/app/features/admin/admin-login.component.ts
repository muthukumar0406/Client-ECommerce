import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-admin-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="login-container">
      <div class="login-card glass-panel">
        <div class="header">
          <h2>Admin Login</h2>
          <p>Secure Access Only</p>
        </div>
        
        <form (ngSubmit)="login()">
          <div class="form-group">
            <label>Username</label>
            <input type="text" [(ngModel)]="username" name="username" placeholder="Enter username" required>
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="Enter password" required>
          </div>
          
          <div class="error" *ngIf="errorMessage">{{ errorMessage }}</div>
          
          <button type="submit" class="btn btn-primary btn-block" [disabled]="loading">
            {{ loading ? 'Authenticating...' : 'Login' }}
          </button>
        </form>
        
        <div class="credentials-hint">
            <small>Use: Muthukumar / Admin@kumar</small>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    
    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 2.5rem;
      border-radius: 16px;
      background: white;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    
    .header { text-align: center; margin-bottom: 2rem; }
    .header h2 { color: var(--text-main); font-weight: 700; margin-bottom: 0.5rem; }
    .header p { color: var(--text-muted); }
    
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-main); }
    .form-group input {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s;
    }
    .form-group input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    
    .btn-block { width: 100%; padding: 0.9rem; font-size: 1rem; }
    
    .error {
      color: var(--danger-color);
      background: rgba(239, 68, 68, 0.1);
      padding: 0.8rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      text-align: center;
      font-size: 0.9rem;
    }
    
    .credentials-hint {
        margin-top: 2rem;
        text-align: center;
        color: var(--text-muted);
        font-family: monospace;
    }
  `]
})
export class AdminLoginComponent {
    username = '';
    password = '';
    errorMessage = '';
    loading = false;

    constructor(private http: HttpClient, private router: Router) { }

    login() {
        this.loading = true;
        this.errorMessage = '';

        // Quick frontend check as well to avoid roundtrip if obviously wrong (optional but good for UX)
        // But we will hit the API as per good practice (even if we just modified it to be hardcoded)

        this.http.post('http://160.187.68.165:5001/api/admin/login', {
            username: this.username,
            password: this.password
        }).subscribe({
            next: (res: any) => {
                localStorage.setItem('adminToken', res.token);
                this.router.navigate(['/admin']); // Redirect to dashboard
                this.loading = false;
            },
            error: (err) => {
                this.errorMessage = 'Invalid username or password';
                this.loading = false;
            }
        });
    }
}
