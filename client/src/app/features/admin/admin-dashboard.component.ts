import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome back, Admin</p>
    </div>
    
    <div class="stats-grid">
        <div class="stat-card glass-panel">
            <div class="icon c1"><i class="fas fa-shopping-bag"></i></div>
            <div class="stat-info">
                <h3>Total Sales</h3>
                <p class="value">₹1,24,500</p>
                <span class="trend up">+12% this week</span>
            </div>
        </div>
        
        <div class="stat-card glass-panel">
            <div class="icon c2"><i class="fas fa-box-open"></i></div>
            <div class="stat-info">
                <h3>Total Orders</h3>
                <p class="value">450</p>
                <span class="trend up">+5% this week</span>
            </div>
        </div>
        
        <div class="stat-card glass-panel">
            <div class="icon c3"><i class="fas fa-users"></i></div>
            <div class="stat-info">
                <h3>New Users</h3>
                <p class="value">1,205</p>
                <span class="trend up">+18% this week</span>
            </div>
        </div>
        
        <div class="stat-card glass-panel">
            <div class="icon c4"><i class="fas fa-exclamation-circle"></i></div>
            <div class="stat-info">
                <h3>Pending Issues</h3>
                <p class="value">5</p>
                <span class="trend down">-2% this week</span>
            </div>
        </div>
    </div>
    
    <div class="recent-orders glass-panel">
        <h3>Recent Orders</h3>
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>#ORD-001</td>
                        <td>John Doe</td>
                        <td>Jan 21, 2026</td>
                        <td><span class="badge badge-success">Completed</span></td>
                        <td>₹2,500</td>
                    </tr>
                    <tr>
                        <td>#ORD-002</td>
                        <td>Jane Smith</td>
                        <td>Jan 21, 2026</td>
                        <td><span class="badge badge-warning">Pending</span></td>
                        <td>₹1,200</td>
                    </tr>
                    <tr>
                        <td>#ORD-003</td>
                        <td>Mike Ross</td>
                        <td>Jan 20, 2026</td>
                        <td><span class="badge badge-primary">Processing</span></td>
                        <td>₹5,400</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `,
    styles: [`
    .dashboard-header { margin-bottom: 2rem; }
    .dashboard-header h2 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .stat-card {
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }
    
    .icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: white;
    }
    .c1 { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
    .c2 { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .c3 { background: linear-gradient(135deg, #10b981, #059669); }
    .c4 { background: linear-gradient(135deg, #ef4444, #dc2626); }
    
    .stat-info h3 { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem; }
    .value { font-size: 1.8rem; font-weight: 700; margin-bottom: 0.25rem; }
    .trend { font-size: 0.8rem; font-weight: 500; }
    .trend.up { color: var(--success-color); }
    .trend.down { color: var(--danger-color); }
    
    .recent-orders { padding: 1.5rem; }
    .recent-orders h3 { margin-bottom: 1.5rem; }
    
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 1rem; color: var(--text-muted); border-bottom: 1px solid rgba(0,0,0,0.1); }
    td { padding: 1rem; border-bottom: 1px solid rgba(0,0,0,0.05); }
    
    .badge { padding: 0.25rem 0.75rem; border-radius: 2rem; font-size: 0.8rem; font-weight: 600; }
    .badge-success { background: rgba(16, 185, 129, 0.1); color: var(--success-color); }
    .badge-warning { background: rgba(245, 158, 11, 0.1); color: var(--warning-color); }
    .badge-primary { background: rgba(99, 102, 241, 0.1); color: var(--primary-color); }
    `]
})
export class AdminDashboardComponent { }
