import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../core/services/order.service';

@Component({
    selector: 'app-admin-orders',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-header">
        <h2>Order Summary</h2>
        <button class="btn btn-outline" (click)="loadOrders()">
            <i class="fas fa-sync"></i> Refresh
        </button>
    </div>

    <div class="orders-list">
        @for (order of orders(); track order.id) {
            <div class="order-card glass-panel">
                <div class="order-header">
                    <div>
                        <span class="order-id">#{{order.orderNumber || order.id}}</span>
                        <span class="order-date">{{order.createdDate | date:'medium'}}</span>
                    </div>
                    <span class="status-badge" [class.pending]="true">{{order.status || 'Pending'}}</span>
                </div>
                
                <div class="customer-details">
                    <div class="detail-row">
                        <i class="fas fa-user"></i> <span>{{order.customerName}}</span>
                    </div>
                    <div class="detail-row">
                        <i class="fas fa-phone"></i> <span>{{order.customerPhone}}</span>
                    </div>
                    <div class="detail-row">
                        <i class="fas fa-map-marker-alt"></i> 
                        <span>
                            {{order.address.street}}, {{order.address.city}}
                        </span>
                    </div>
                </div>

                <div class="items-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            @for (item of order.items; track item.id || item.productId) {
                                <tr>
                                    <td>{{item.productName}}</td>
                                    <td>{{item.quantity}}</td>
                                    <td>₹{{item.totalPrice}}</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>

                <div class="order-footer">
                    <span class="total-label">Total Amount</span>
                    <span class="total-amount">₹{{order.finalAmount}}</span>
                </div>
            </div>
        } @empty {
            <div class="empty-state">
                <p>No orders received yet.</p>
            </div>
        }
    </div>
  `,
    styles: [`
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }
    
    .orders-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
    }
    
    .order-card {
        padding: 1.5rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: 1rem;
        border-bottom: 1px solid #f1f5f9;
    }
    .order-id { font-weight: 700; display: block; }
    .order-date { font-size: 0.85rem; color: var(--text-muted); }
    
    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.8rem;
        font-weight: 600;
        background: #f1f5f9;
        color: var(--text-muted);
    }
    .status-badge.pending { background: rgba(245, 158, 11, 0.1); color: var(--warning-color); }
    
    .customer-details {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-size: 0.95rem;
    }
    .detail-row { display: flex; align-items: start; gap: 0.8rem; color: var(--text-muted); }
    .detail-row i { width: 16px; margin-top: 4px; color: var(--primary-color); }
    
    .items-table {
        margin-top: 0.5rem;
        background: #f8fafc;
        border-radius: 8px;
        padding: 0.5rem;
    }
    .items-table table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .items-table th { text-align: left; padding: 0.5rem; color: var(--text-muted); font-weight: 600; }
    .items-table td { padding: 0.5rem; border-top: 1px solid #e2e8f0; }
    
    .order-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        padding-top: 1rem;
        border-top: 1px solid #f1f5f9;
    }
    .total-label { font-weight: 600; }
    .total-amount { font-size: 1.2rem; font-weight: 700; color: var(--primary-color); }
    
    .empty-state { grid-column: 1 / -1; text-align: center; padding: 4rem; color: var(--text-muted); }
  `]
})
export class AdminOrdersComponent implements OnInit {
    orders = signal<Order[]>([]);

    constructor(private orderService: OrderService) { }

    ngOnInit() {
        this.loadOrders();
    }

    loadOrders() {
        this.orderService.getAllOrders().subscribe(res => {
            this.orders.set(res);
        });
    }
}
