import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container cart-page">
      <div class="header-row">
          <a routerLink="/" class="back-btn"><i class="fas fa-arrow-left"></i> Back</a>
          <h2 class="page-title">My Cart</h2>
      </div>

      @if (orderPlaced) {
        <div class="success-screen glass-panel animate-slide-up">
            <div class="icon-circle">
                <i class="fas fa-check"></i>
            </div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your purchase. Your order #{{lastOrderId}} has been confirmed.</p>
            <a routerLink="/products" class="btn btn-primary" (click)="reset()">Continue Shopping</a>
        </div>
      } @else if (cartItems().length === 0) {
        <div class="empty-state glass-panel animate-slide-up">
          <i class="fas fa-shopping-basket"></i>
          <h3>Your bag is empty</h3>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <a routerLink="/products" class="btn btn-primary">Start Shopping</a>
        </div>
      } @else {
        <div class="cart-layout">
          <div class="left-col">
              <!-- DELIVERY DETAILS -->
              <div class="form-section glass-panel">
                  <h3><i class="fas fa-truck"></i> Delivery Details</h3>
                  <div class="form-grid">
                      <div class="form-group">
                          <label>Name</label>
                          <input type="text" [(ngModel)]="orderDetails.name" placeholder="Full Name" required>
                      </div>
                      <div class="form-group">
                          <label>Phone Number</label>
                          <input type="tel" [(ngModel)]="orderDetails.phone" placeholder="+91 98765 43210" required>
                      </div>
                      <div class="form-group full">
                          <label>Address</label>
                          <textarea [(ngModel)]="orderDetails.address" placeholder="House No, Street Area" rows="2"></textarea>
                      </div>
                      <div class="form-group">
                          <label>Location</label>
                          <input type="text" [(ngModel)]="orderDetails.location" placeholder="City / Area">
                      </div>
                      <div class="form-group">
                          <label>Email</label>
                          <input type="email" [(ngModel)]="orderDetails.email" placeholder="Optional for receipt">
                      </div>
                  </div>
              </div>
          
              <!-- ORDER SUMMARY LIST -->
              <div class="cart-items glass-panel">
                 <h3>Order Items ({{cartItems().length}})</h3>
                @for (item of cartItems(); track item.product.id) {
                  <div class="cart-item">
                    <div class="item-image">
                      <img [src]="item.product.imageUrls[0] || 'assets/placeholder.png'" 
                           onerror="this.src='https://via.placeholder.com/100'"
                           [alt]="item.product.name">
                    </div>
                    <div class="item-details">
                      <h4>{{ item.product.name }}</h4>
                      <div class="qty-price">
                          <div class="quantity-control">
                            <button (click)="updateQty(item.product.id, -1)" [disabled]="item.quantity <= 1">-</button>
                            <span>{{ item.quantity }}</span>
                            <button (click)="updateQty(item.product.id, 1)">+</button>
                          </div>
                          <p class="price">₹{{ (item.product.price * item.quantity) | number }}</p>
                      </div>
                    </div>
                    <button class="remove-btn" (click)="remove(item.product.id)"><i class="fas fa-trash"></i></button>
                  </div>
                }
              </div>
          </div>

          <!-- SUMMARY & BUY BTN -->
          <div class="right-col">
             <div class="cart-summary glass-panel sticky-summary">
                <h3>Price Details</h3>
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>₹{{ totalPrice() | number }}</span>
                </div>
                <div class="summary-row highlight">
                  <span>Discount</span>
                  <span>- ₹0</span>
                </div>
                <div class="summary-row">
                  <span>Delivery Charges</span>
                  <span class="free">Free</span>
                </div>
                <div class="divider"></div>
                <div class="summary-total">
                  <span>Total Payable</span>
                  <span>₹{{ totalPrice() | number }}</span>
                </div>
                
                <!-- Fixed Bottom Button for Mobile, Normal for Desktop -->
             </div>
          </div>
        </div>
        
        <!-- FIXED BUY NOW BUTTON BAR -->
        <div class="fixed-buy-bar">
            <div class="total-info">
                <small>Total</small>
                <span>₹{{ totalPrice() | number }}</span>
            </div>
            <button class="buy-now-btn" (click)="checkout()" [disabled]="isProcessing || !isValid()">
                 {{ isProcessing ? 'Processing...' : 'BUY NOW' }}
            </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-page { padding-bottom: 100px; }
    .header-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .back-btn { color: var(--text-main); text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
    .page-title { margin: 0; font-size: 1.5rem; }

    .cart-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    @media (min-width: 900px) {
        .cart-layout { grid-template-columns: 2fr 1.2fr; }
    }
    
    .glass-panel { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    h3 { margin-bottom: 1.5rem; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem; color: var(--text-main); }
    
    /* FORM */
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group.full { grid-column: 1 / -1; }
    .form-group label { display: block; margin-bottom: 0.4rem; font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }
    .form-group input, .form-group textarea { width: 100%; padding: 0.8rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.95rem; }
    .form-group input:focus { border-color: var(--primary-color); outline: none; }
    
    /* ITEMS */
    .cart-item { display: flex; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid #f1f5f9; position: relative; }
    .cart-item:last-child { border-bottom: none; }
    .item-image { width: 70px; height: 70px; background: #f8fafc; border-radius: 8px; padding: 5px; display: flex; align-items: center; justify-content: center; }
    .item-image img { max-width: 100%; max-height: 100%; object-fit: contain; }
    
    .item-details { flex: 1; }
    .item-details h4 { margin: 0 0 0.5rem; font-size: 1rem; }
    .qty-price { display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem; }
    .price { font-weight: 700; color: var(--text-main); }
    
    .quantity-control { display: flex; align-items: center; border: 1px solid #e2e8f0; border-radius: 6px; }
    .quantity-control button { width: 28px; height: 28px; border: none; background: none; cursor: pointer; }
    .quantity-control span { padding: 0 0.5rem; font-size: 0.9rem; font-weight: 600; }
    
    .remove-btn { border: none; background: none; color: var(--text-muted); cursor: pointer; position: absolute; top: 1rem; right: 0; }
    
    /* SUMMARY */
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-size: 0.95rem; color: var(--text-muted); }
    .highlight { color: var(--success-color); }
    .free { color: var(--success-color); font-weight: 600; }
    .divider { border-top: 1px dashed #e2e8f0; margin: 1rem 0; }
    .summary-total { display: flex; justify-content: space-between; font-weight: 700; font-size: 1.2rem; color: var(--text-main); }
    
    /* FIXED BAR */
    .fixed-buy-bar {
        position: fixed; bottom: 0; left: 0; right: 0; background: white; padding: 1rem 1.5rem;
        box-shadow: 0 -5px 20px rgba(0,0,0,0.1); z-index: 1000;
        display: flex; justify-content: space-between; align-items: center;
    }
    .total-info { display: flex; flex-direction: column; }
    .total-info small { color: var(--text-muted); font-size: 0.8rem; }
    .total-info span { font-weight: 700; font-size: 1.2rem; color: var(--text-main); }
    
    .buy-now-btn {
        background: var(--primary-color); color: white; border: none;
        padding: 0.9rem 2.5rem; border-radius: 8px; font-weight: 700; font-size: 1.1rem;
        cursor: pointer; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        transition: all 0.2s;
    }
    .buy-now-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .buy-now-btn:hover:not(:disabled) { transform: translateY(-2px); }

    /* Success */
    .success-screen { text-align: center; padding: 4rem 2rem; }
    .icon-circle { width: 80px; height: 80px; background: var(--success-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.5rem; }
  `]
})
export class CartComponent {
  private orderService = inject(OrderService);
  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;

  isProcessing = false;
  orderPlaced = false;
  lastOrderId = '';

  orderDetails = {
    name: '',
    phone: '',
    address: '',
    location: '',
    email: ''
  };

  constructor(private cartService: CartService) { }

  updateQty(productId: number, change: number) {
    const item = this.cartItems().find(i => i.product.id === productId);
    if (item) {
      const newQty = item.quantity + change;
      if (newQty > 0) this.cartService.updateQuantity(productId, newQty);
    }
  }

  remove(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  isValid() {
    return this.orderDetails.name && this.orderDetails.phone && this.orderDetails.address;
  }

  checkout() {
    if (!this.isValid()) return;
    this.isProcessing = true;

    const orderDto = {
      customerName: this.orderDetails.name,
      customerEmail: this.orderDetails.email || 'guest@example.com',
      customerPhone: this.orderDetails.phone,
      shippingAddress: {
        street: this.orderDetails.address,
        city: this.orderDetails.location || 'Unknown',
        state: 'State', // Default for now
        zipCode: '000000',
        country: 'India'
      },
      items: this.cartItems().map(i => ({
        productId: i.product.id,
        quantity: i.quantity
      }))
    };

    this.orderService.createOrder(orderDto).subscribe({
      next: (res) => {
        this.isProcessing = false;
        this.orderPlaced = true;
        this.lastOrderId = res.orderNumber || '000';
        this.cartService.clearCart();
      },
      error: (err) => {
        console.error(err);
        this.isProcessing = false;
        alert('Failed to place order. Please try again.');
      }
    });
  }

  reset() {
    this.orderPlaced = false;
    this.orderDetails = { name: '', phone: '', address: '', location: '', email: '' };
  }
}
