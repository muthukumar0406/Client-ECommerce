import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../core/services/cart.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="container cart-page">
      <h2 class="page-title">Shopping Bag</h2>

      @if (orderPlaced) {
        <div class="success-screen glass-panel animate-slide-up">
            <div class="icon-circle">
                <i class="fas fa-check"></i>
            </div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your purchase. You will receive an email confirmation shortly.</p>
            <div class="order-id">Order ID: #{{lastOrderId}}</div>
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
          <div class="cart-items">
            @for (item of cartItems(); track item.product.id) {
              <div class="cart-item glass-panel">
                <div class="item-image">
                  <img [src]="item.product.imageUrls[0] || 'assets/placeholder.png'" 
                       onerror="this.src='https://via.placeholder.com/100'"
                       [alt]="item.product.name">
                </div>
                <div class="item-details">
                  <h3>{{ item.product.name }}</h3>
                  <p class="price">₹{{ item.product.price | number }}</p>
                  <p class="stock status-in-stock">In Stock</p>
                </div>
                <div class="item-actions">
                  <div class="quantity-control">
                    <button (click)="updateQty(item, -1)" [disabled]="item.quantity <= 1">-</button>
                    <span>{{ item.quantity }}</span>
                    <button (click)="updateQty(item, 1)">+</button>
                  </div>
                  <button class="remove-btn" (click)="remove(item)">Remove</button>
                </div>
                <div class="item-total">
                  ₹{{ (item.product.price * item.quantity) | number }}
                </div>
              </div>
            }
          </div>

          <div class="cart-summary glass-panel">
            <h3>Order Summary</h3>
            <div class="summary-row">
              <span>Subtotal</span>
              <span>₹{{ totalPrice() | number }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div class="summary-row">
              <span>Tax (Est.)</span>
              <span>₹{{ (totalPrice() * 0.18) | number }}</span>
            </div>
            <div class="divider"></div>
            <div class="summary-total">
              <span>Total</span>
              <span>₹{{ (totalPrice() * 1.18) | number }}</span>
            </div>

            <button class="btn btn-primary checkout-btn" (click)="checkout()">
              {{ isProcessing ? 'Processing...' : 'Proceed to Checkout' }}
            </button>

            <div class="secure-checkout">
                <i class="fas fa-lock"></i> Secure Checkout
            </div>
          </div>
        </div>
      }
    </div>
  `,
    styles: [`
    .cart-page { padding-top: 2rem; padding-bottom: 3rem; }
    .page-title { margin-bottom: 2rem; font-size: 2rem; }

    .cart-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    @media (min-width: 900px) {
        .cart-layout { grid-template-columns: 2fr 1fr; }
    }

    /* Empty State */
    .empty-state {
        text-align: center;
        padding: 4rem 2rem;
    }
    .empty-state i { font-size: 4rem; color: var(--text-muted); margin-bottom: 1.5rem; }
    
    /* Success Screen */
    .success-screen {
        text-align: center;
        padding: 4rem 2rem;
        max-width: 600px;
        margin: 0 auto;
    }
    .icon-circle {
        width: 80px;
        height: 80px;
        background: var(--success-color);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        margin: 0 auto 1.5rem;
    }

    /* Cart Items */
    .cart-items { display: flex; flex-direction: column; gap: 1.5rem; }
    
    .cart-item {
        padding: 1.5rem;
        display: flex;
        gap: 1.5rem;
        align-items: flex-start;
        flex-wrap: wrap;
    }
    
    .item-image {
        width: 100px;
        height: 100px;
        background: white;
        padding: 10px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .item-image img { max-width: 100%; max-height: 100%; object-fit: contain; }
    
    .item-details { flex: 1; min-width: 200px; }
    .item-details h3 { font-size: 1.1rem; margin-bottom: 0.5rem; }
    .item-details .price { font-weight: 600; color: var(--text-main); margin-bottom: 0.5rem; }
    .status-in-stock { color: var(--success-color); font-size: 0.9rem; }
    
    .item-actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
    
    .quantity-control {
        display: flex;
        align-items: center;
        background: rgba(255,255,255,0.5);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        overflow: hidden;
    }
    .quantity-control button {
        border: none;
        background: none;
        padding: 0.5rem 0.8rem;
        cursor: pointer;
    }
    .quantity-control span { padding: 0 0.5rem; font-weight: 600; }
    
    .remove-btn {
        background: none;
        border: none;
        color: var(--danger-color);
        font-size: 0.9rem;
        cursor: pointer;
        text-decoration: underline;
    }
    
    .item-total {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--primary-color);
        min-width: 80px;
        text-align: right;
    }

    /* Summary */
    .cart-summary {
        padding: 2rem;
        height: fit-content;
    }
    
    .cart-summary h3 { margin-bottom: 1.5rem; }
    
    .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        color: var(--text-muted);
    }
    
    .divider { height: 1px; background: rgba(0,0,0,0.1); margin: 1.5rem 0; }
    
    .summary-total {
        display: flex;
        justify-content: space-between;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: 2rem;
    }
    
    .checkout-btn { width: 100%; font-size: 1.1rem; padding: 1rem; }
    
    .secure-checkout {
        text-align: center;
        margin-top: 1rem;
        color: var(--text-muted);
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }
  `]
})
export class CartComponent {
    cartItems = this.cartService.cartItems;
    totalPrice = this.cartService.totalPrice;

    isProcessing = false;
    orderPlaced = false;
    lastOrderId = '';

    constructor(private cartService: CartService) { }

    updateQty(item: CartItem, change: number) {
        const newQty = item.quantity + change;
        if (newQty > 0) {
            this.cartService.updateQuantity(item.product.id, newQty);
        }
    }

    remove(item: CartItem) {
        this.cartService.removeFromCart(item.product.id);
    }

    checkout() {
        this.isProcessing = true;

        // Simulate API call
        setTimeout(() => {
            this.isProcessing = false;
            this.orderPlaced = true;
            this.lastOrderId = Math.floor(Math.random() * 1000000).toString();
            this.cartService.clearCart();
        }, 2000);
    }

    reset() {
        this.orderPlaced = false;
    }
}
