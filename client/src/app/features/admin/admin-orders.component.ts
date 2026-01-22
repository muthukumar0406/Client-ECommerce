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
            <h2>Order Management</h2>
            <div class="tabs">
                <button [class.active]="activeTab() === 'all'" (click)="activeTab.set('all')">Active</button>
                <button [class.active]="activeTab() === 'completed'" (click)="activeTab.set('completed')">Completed</button>
            </div>
        </div>
        <button class="btn btn-outline" (click)="loadOrders()">
            <i class="fas fa-sync"></i> Refresh
        </button>
    </div>

    <div class="orders-container">
        <!-- Compact Header Row -->
        <div class="orders-header-row">
            <span>Order Info</span>
            <span>Customer</span>
            <span class="desktop-only">Contact</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Action</span>
        </div>

        @for (order of filteredOrders(); track order.id) {
            <div class="order-row-item" [class.expanded]="expandedOrderId() === order.id">
                <div class="order-summary-row" (click)="toggleExpand(order.id)">
                    <div class="col-info">
                        <strong>#{{order.orderNumber || order.id}}</strong>
                        <small>{{order.orderDate | date:'shortDate'}}</small>
                    </div>
                    <div class="col-customer">
                        <span>{{order.customerName}}</span>
                    </div>
                    <div class="col-contact desktop-only">
                        <span>{{order.customerPhone}}</span>
                    </div>
                    <div class="col-amount">
                        <strong>₹{{order.finalAmount}}</strong>
                    </div>
                    <div class="col-status">
                         <span class="status-dot" [class.completed]="order.status === 'Completed'"></span>
                         {{order.status}}
                    </div>
                    <div class="col-actions">
                        <button class="btn-icon" (click)="$event.stopPropagation(); toggleExpand(order.id)">
                            <i class="fas" [class.fa-chevron-down]="expandedOrderId() !== order.id" [class.fa-chevron-up]="expandedOrderId() === order.id"></i>
                        </button>
                    </div>
                </div>

                <!-- Expanded Details -->
                <div class="order-details-pane" *ngIf="expandedOrderId() === order.id">
                    <div class="details-grid">
                        <div class="detail-section">
                            <label>Delivery Details</label>
                            <p><strong>Phone:</strong> {{order.customerPhone}}</p>
                            <p><strong>Email:</strong> {{order.customerEmail}}</p>
                            <p><strong>Address:</strong> {{order.address.street}}, {{order.address.city}}, {{order.address.state}} - {{order.address.zipCode}}</p>
                        </div>
                        <div class="detail-section">
                            <label>Items Ordered ({{order.items.length}})</label>
                            <ul class="items-list">
                                @for (item of order.items; track item.productId) {
                                    <li>
                                        <span>{{item.productName}}</span>
                                        <strong>{{item.quantity}} x {{item.quantityUnit || 'Unit'}}</strong>
                                        <span class="subtotal">₹{{item.unitPrice * item.quantity}}</span>
                                    </li>
                                }
                            </ul>
                        </div>
                    </div>
                    <div class="pane-footer">
                        <div class="dangerous-actions">
                             <button class="btn btn-danger btn-sm" (click)="deleteOrder(order.id)">
                                <i class="fas fa-trash"></i> Delete Order
                            </button>
                        </div>
                        <div class="positive-actions">
                            <button class="btn btn-success btn-sm" *ngIf="order.status !== 'Completed'" (click)="completeOrder(order.id)">
                                <i class="fas fa-check"></i> Mark as Completed
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        } @empty {
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>No orders to display.</p>
            </div>
        }
    </div>

    <div class="grand-summary-bar" *ngIf="activeTab() === 'completed' && completedOrdersTotal() > 0">
        <label>Total Revenue</label>
        <strong>₹{{completedOrdersTotal() | number}}</strong>
    </div>
  `,
    styles: [`
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }
    
    .tabs {
        display: flex;
        background: #f1f5f9;
        padding: 0.3rem;
        border-radius: 12px;
        gap: 0.3rem;
    }
    
    .tabs button {
        padding: 0.5rem 1.2rem;
        border: none;
        background: transparent;
        cursor: pointer;
        border-radius: 8px;
        font-weight: 600;
        color: #64748b;
        transition: all 0.2s;
        font-size: 0.85rem;
    }
    
    .tabs button.active {
        color: var(--primary-color);
        background: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .orders-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .orders-header-row {
        display: grid;
        grid-template-columns: 120px 2fr 1.5fr 1fr 120px 60px;
        padding: 1rem 1.5rem;
        background: #f8fafc;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 700;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .order-row-item {
        background: white;
        border-radius: 12px;
        border: 1px solid #f1f5f9;
        overflow: hidden;
        transition: all 0.2s;
    }
    .order-row-item:hover { border-color: #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
    .order-row-item.expanded { border-color: var(--primary-color); box-shadow: 0 8px 20px rgba(0,0,0,0.05); }

    .order-summary-row {
        display: grid;
        grid-template-columns: 120px 2fr 1.5fr 1fr 120px 60px;
        padding: 1.2rem 1.5rem;
        align-items: center;
        cursor: pointer;
    }

    .col-info { display: flex; flex-direction: column; }
    .col-info strong { color: #0f172a; font-size: 0.95rem; }
    .col-info small { color: #94a3b8; font-size: 0.75rem; }

    .col-customer { font-weight: 600; color: #334155; }
    .col-contact { color: #64748b; font-size: 0.9rem; }
    .col-amount { font-weight: 700; color: #0f172a; }
    
    .col-status { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; color: #64748b; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #fbbf24; }
    .status-dot.completed { background: #22c55e; }

    .order-details-pane {
        padding: 2rem;
        background: #fcfcfd;
        border-top: 1px solid #f1f5f9;
        animation: slideDown 0.2s ease-out;
    }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

    .details-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        margin-bottom: 2rem;
    }

    .detail-section label {
        display: block;
        font-size: 0.75rem;
        font-weight: 800;
        color: #94a3b8;
        text-transform: uppercase;
        margin-bottom: 1rem;
        letter-spacing: 0.5px;
    }

    .detail-section p { margin-bottom: 0.5rem; color: #475569; font-size: 0.95rem; }

    .items-list { list-style: none; padding: 0; }
    .items-list li {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem 0;
        border-bottom: 1px dashed #e2e8f0;
        font-size: 0.9rem;
    }
    .items-list li:last-child { border-bottom: none; }
    .items-list .subtotal { font-weight: 700; color: #0f172a; }

    .pane-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1.5rem;
        border-top: 1px solid #e2e8f0;
    }

    .grand-summary-bar {
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        background: #0f172a;
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        display: flex;
        align-items: baseline;
        gap: 1rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .grand-summary-bar label { font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; font-weight: 700; }
    .grand-summary-bar strong { font-size: 1.5rem; color: #60a5fa; }

    .btn-icon {
        width: 32px; height: 32px;
        border-radius: 8px; border: 1px solid #e2e8f0;
        background: white; color: #94a3b8;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: all 0.2s;
    }
    .btn-icon:hover { border-color: var(--primary-color); color: var(--primary-color); }

    .desktop-only { display: block; }
    @media (max-width: 1000px) {
        .desktop-only { display: none; }
        .orders-header-row, .order-summary-row { grid-template-columns: 100px 1.5fr 1fr 100px 50px; }
    }
    @media (max-width: 600px) {
        .orders-header-row { display: none; }
        .order-summary-row { grid-template-columns: 1fr 1fr 40px; gap: 0.5rem; }
        .col-status, .col-amount { font-size: 0.8rem; }
        .details-grid { grid-template-columns: 1fr; gap: 2rem; }
        .pane-footer { flex-direction: column; gap: 1rem; align-items: stretch; }
        .btn-sm { justify-content: center; }
        .grand-summary-bar { left: 1rem; right: 1rem; bottom: 1rem; justify-content: space-between; }
    }

    .empty-state { text-align: center; padding: 4rem 2rem; color: #94a3b8; }
    .empty-state i { font-size: 3rem; margin-bottom: 1rem; opacity: 0.2; }
  `]
})
export class AdminOrdersComponent implements OnInit {
    orders = signal<Order[]>([]);
    activeTab = signal<'all' | 'completed'>('all');
    expandedOrderId = signal<number | null>(null);

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

    toggleExpand(id: number) {
        this.expandedOrderId.update((current: number | null) => current === id ? null : id);
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
