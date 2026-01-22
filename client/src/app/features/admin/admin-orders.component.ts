import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../core/services/order.service';

@Component({
    selector: 'app-admin-orders',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-header">
        <div>
            <h2>Order Summary</h2>
            <div class="tabs">
                <button [class.active]="activeTab() === 'all'" (click)="activeTab.set('all')">All Orders</button>
                <button [class.active]="activeTab() === 'completed'" (click)="activeTab.set('completed')">Completed Orders</button>
            </div>
        </div>
        <button class="btn btn-outline" (click)="loadOrders()">
            <i class="fas fa-sync"></i> Refresh
        </button>
    </div>

    <div class="orders-list">
        @for (order of filteredOrders(); track order.id) {
            <div class="order-card glass-panel">
                <div class="order-header">
                    <div>
                        <span class="order-id">#{{order.orderNumber || order.id}}</span>
                        <span class="order-date">{{order.orderDate | date:'medium'}}</span>
                    </div>
                    <span class="status-badge" [class.completed]="order.status === 'Completed'" [class.pending]="order.status !== 'Completed'">
                        {{order.status}}
                    </span>
                </div>
                
                <div class="customer-info-grid">
                    <div class="info-item">
                        <label>Customer Name</label>
                        <span>{{order.customerName}}</span>
                    </div>
                    <div class="info-item">
                        <label>Mobile Number</label>
                        <span>{{order.customerPhone}}</span>
                    </div>
                    <div class="info-item full">
                        <label>Delivery Address</label>
                        <span>{{order.address.street}}, {{order.address.city}}, {{order.address.state}} - {{order.address.zipCode}}</span>
                    </div>
                </div>

                <div class="items-summary">
                    <label>Ordered Items</label>
                    <div class="items-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Qty & Unit</th>
                                    <th>Price</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                @for (item of order.items; track item.productId) {
                                    <tr>
                                        <td>{{item.productName}}</td>
                                        <td>{{item.quantity}} x {{item.quantityUnit || 'Unit'}}</td>
                                        <td>₹{{item.unitPrice}}</td>
                                        <td>₹{{item.unitPrice * item.quantity}}</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="order-footer">
                    <div class="order-total">
                        <span class="total-label">Grand Total</span>
                        <span class="total-amount">₹{{order.finalAmount}}</span>
                    </div>
                    <div class="order-actions" *ngIf="order.status !== 'Completed'">
                        <button class="btn btn-danger btn-sm" (click)="deleteOrder(order.id)">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                        <button class="btn btn-success btn-sm" (click)="completeOrder(order.id)">
                            <i class="fas fa-check"></i> Complete
                        </button>
                    </div>
                </div>
            </div>
        } @empty {
            <div class="empty-state">
                <p>No orders found in this section.</p>
            </div>
        }
    </div>

    <div class="grand-summary glass-panel" *ngIf="activeTab() === 'completed' && completedOrdersTotal() > 0">
        <div class="summary-content">
            <span class="label">Total Revenue (Completed Orders)</span>
            <span class="amount">₹{{completedOrdersTotal()}}</span>
        </div>
    </div>
  `,
    styles: [`
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
    }
    
    .tabs {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .tabs button {
        padding: 0.5rem 1.5rem;
        border: none;
        background: none;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        font-weight: 600;
        color: var(--text-muted);
        transition: all 0.3s ease;
    }
    
    .tabs button.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
    }

    .orders-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 5rem;
    }
    
    .order-card {
        padding: 1.5rem;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    
    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 1.2rem;
        border-bottom: 1px solid #f1f5f9;
        margin-bottom: 1.2rem;
    }
    .order-id { font-weight: 700; font-size: 1.1rem; color: var(--primary-color); display: block; }
    .order-date { font-size: 0.85rem; color: var(--text-muted); }
    
    .status-badge {
        padding: 0.4rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
    }
    .status-badge.pending { background: #fff7ed; color: #c2410c; }
    .status-badge.completed { background: #f0fdf4; color: #15803d; }
    
    .customer-info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    .info-item { display: flex; flex-direction: column; }
    .info-item.full { grid-column: 1 / -1; }
    .info-item label { font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 0.2rem; }
    .info-item span { font-weight: 500; }
    
    .items-summary label { font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 0.5rem; }
    .items-table {
        background: #f8fafc;
        border-radius: 12px;
        overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 0.8rem; font-size: 0.8rem; color: var(--text-muted); }
    td { padding: 0.8rem; border-top: 1px solid #e2e8f0; font-size: 0.9rem; }
    
    .order-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1.5rem;
        padding-top: 1.2rem;
        border-top: 1px solid #f1f5f9;
    }
    
    .order-total { display: flex; flex-direction: column; }
    .total-label { font-size: 0.8rem; color: var(--text-muted); }
    .total-amount { font-size: 1.4rem; font-weight: 800; color: var(--text-main); }
    
    .order-actions { display: flex; gap: 0.8rem; }
    
    .btn-success { background: #22c55e; color: white; border: none; }
    .btn-danger { background: #ef4444; color: white; border: none; }
    .btn-sm { padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; font-weight: 600; }
    
    .grand-summary {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 600px;
        padding: 1.5rem 2rem;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(var(--primary-rgb), 0.2);
        z-index: 1000;
        border-radius: 100px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .summary-content { display: flex; justify-content: space-between; align-items: center; }
    .grand-summary .label { font-weight: 600; color: var(--text-muted); }
    .grand-summary .amount { font-size: 1.8rem; font-weight: 800; color: var(--primary-color); }
    
    @media (max-width: 600px) {
        .customer-info-grid { grid-template-columns: 1fr; }
        .order-footer { flex-direction: column; gap: 1rem; align-items: stretch; }
        .order-actions { justify-content: space-between; }
        .tabs { overflow-x: auto; padding-bottom: 0.5rem; }
        .tabs button { white-space: nowrap; }
    }

    .empty-state { text-align: center; padding: 4rem; color: var(--text-muted); }
  `]
})
export class AdminOrdersComponent implements OnInit {
    orders = signal<Order[]>([]);
    activeTab = signal<'all' | 'completed'>('all');

    filteredOrders = computed(() => {
        const currentTab = this.activeTab();
        if (currentTab === 'all') {
            return this.orders();
        } else {
            return this.orders().filter((o: Order) => o.status === 'Completed');
        }
    });

    completedOrdersTotal = computed(() => {
        return this.orders()
            .filter((o: Order) => o.status === 'Completed')
            .reduce((sum: number, o: Order) => sum + o.finalAmount, 0);
    });

    constructor(private orderService: OrderService) { }

    ngOnInit() {
        this.loadOrders();
    }

    loadOrders() {
        this.orderService.getAllOrders().subscribe({
            next: (res: Order[]) => this.orders.set(res),
            error: (err: any) => console.error('Error loading orders', err)
        });
    }

    completeOrder(id: number) {
        if (confirm('Mark this order as completed?')) {
            this.orderService.updateStatus(id, 'Completed').subscribe({
                next: () => {
                    // Update local state for "real-time" update
                    this.orders.update((orders: Order[]) =>
                        orders.map((o: Order) => o.id === id ? { ...o, status: 'Completed' } : o)
                    );
                },
                error: (err: any) => alert('Failed to complete order: ' + err.message)
            });
        }
    }

    deleteOrder(id: number) {
        if (confirm('Are you sure you want to PERMANENTLY delete this order? This action cannot be undone.')) {
            this.orderService.deleteOrder(id).subscribe({
                next: () => {
                    // Update local state
                    this.orders.update((orders: Order[]) => orders.filter((o: Order) => o.id !== id));
                },
                error: (err: any) => alert('Failed to delete order: ' + err.message)
            });
        }
    }
}
