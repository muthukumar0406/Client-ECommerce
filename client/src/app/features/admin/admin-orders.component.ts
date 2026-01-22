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
                <i class="fas fa-clipboard-list"></i>
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
        align-items: center;
        margin-bottom: 2.5rem;
        background: white;
        padding: 1.5rem;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    }
    
    .tabs {
        display: flex;
        background: #f1f5f9;
        padding: 0.4rem;
        border-radius: 12px;
        gap: 0.5rem;
    }
    
    .tabs button {
        padding: 0.6rem 1.5rem;
        border: none;
        background: transparent;
        cursor: pointer;
        border-radius: 8px;
        font-weight: 700;
        color: #64748b;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-size: 0.9rem;
    }
    
    .tabs button.active {
        color: var(--primary-color);
        background: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .orders-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 8rem;
    }
    
    .order-card {
        padding: 2rem;
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.04);
        border: 1px solid #f1f5f9;
        transition: transform 0.3s ease;
    }
    .order-card:hover { transform: translateY(-4px); }
    
    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #f1f5f9;
        margin-bottom: 1.5rem;
    }
    .order-id { font-weight: 800; font-size: 1.2rem; color: var(--text-main); display: block; margin-bottom: 0.3rem; }
    .order-date { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }
    
    .status-badge {
        padding: 0.6rem 1.2rem;
        border-radius: 100px;
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .status-badge.pending { background: #fff7ed; color: #c2410c; border: 1px solid #ffedd5; }
    .status-badge.completed { background: #f0fdf4; color: #15803d; border: 1px solid #dcfce7; }
    
    .customer-info-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
        margin-bottom: 2rem;
        background: #f8fafc;
        padding: 1.5rem;
        border-radius: 16px;
    }
    .info-item { display: flex; flex-direction: column; }
    .info-item.full { grid-column: 1 / -1; }
    .info-item label { font-size: 0.7rem; text-transform: uppercase; color: #94a3b8; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: 1px; }
    .info-item span { font-weight: 600; color: #334155; font-size: 1rem; }
    
    .items-summary label { font-size: 0.7rem; text-transform: uppercase; color: #94a3b8; font-weight: 800; display: block; margin-bottom: 1rem; letter-spacing: 1px; }
    .items-table {
        border: 1px solid #f1f5f9;
        border-radius: 12px;
        overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; background: white; }
    th { text-align: left; padding: 1rem; font-size: 0.75rem; color: #64748b; background: #f8fafc; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 1.2rem 1rem; border-top: 1px solid #f1f5f9; font-size: 0.95rem; color: #334155; }
    
    .order-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid #f1f5f9;
    }
    
    .order-total { display: flex; flex-direction: column; }
    .total-label { font-size: 0.8rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
    .total-amount { font-size: 1.8rem; font-weight: 900; color: var(--primary-color); }
    
    .order-actions { display: flex; gap: 1rem; }
    
    .btn-success { background: #22c55e; color: white; border: none; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2); }
    .btn-danger { background: #ef4444; color: white; border: none; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2); }
    .btn-outline { background: transparent; border: 1px solid #e2e8f0; color: #64748b; }
    .btn-sm { padding: 0.7rem 1.5rem; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 0.6rem; font-weight: 700; transition: all 0.2s; }
    .btn-sm:hover { transform: translateY(-2px); filter: brightness(1.05); }
    
    .grand-summary {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 700px;
        padding: 1.2rem 2.5rem;
        background: rgba(15, 23, 42, 0.9);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 1000;
        border-radius: 100px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    .summary-content { display: flex; justify-content: space-between; align-items: center; }
    .grand-summary .label { font-weight: 600; color: #94a3b8; font-size: 0.95rem; }
    .grand-summary .amount { font-size: 2.2rem; font-weight: 950; color: #60a5fa; letter-spacing: -1px; }
    
    @media (max-width: 900px) {
        .customer-info-grid { grid-template-columns: 1fr 1fr; }
    }
    
    @media (max-width: 600px) {
        .page-header { flex-direction: column; align-items: stretch; gap: 1.5rem; }
        .customer-info-grid { grid-template-columns: 1fr; }
        .order-footer { flex-direction: column; gap: 1.5rem; align-items: stretch; }
        .order-actions { justify-content: space-between; }
        .order-actions .btn-sm { flex: 1; justify-content: center; }
        .grand-summary { border-radius: 20px; width: 95%; bottom: 1rem; }
        .grand-summary .amount { font-size: 1.6rem; }
    }

    .empty-state { text-align: center; padding: 6rem 2rem; color: #94a3b8; background: white; border-radius: 20px; }
    .empty-state i { font-size: 4rem; margin-bottom: 1.5rem; opacity: 0.2; }
    .empty-state p { font-size: 1.2rem; font-weight: 600; }
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
