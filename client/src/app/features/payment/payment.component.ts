import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService, Order } from '../../core/services/order.service';
import { PaymentService } from '../../core/services/payment.service';
import { FormsModule } from '@angular/forms';

declare var Razorpay: any;

@Component({
    selector: 'app-payment',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    template: `
    <div class="container payment-page">
      <div class="header-row">
          <a routerLink="/cart" class="back-btn"><i class="fas fa-arrow-left"></i> Back to Cart</a>
          <h2 class="page-title">Select Payment Method</h2>
      </div>

      @if (isLoading) {
        <div class="loading-state glass-panel">
            <i class="fas fa-spinner fa-spin"></i> Loading Order Details...
        </div>
      } @else if (isSuccess) {
        <div class="success-screen glass-panel animate-slide-up">
            <div class="icon-circle">
                <i class="fas fa-check"></i>
            </div>
            <h2>Order Confirmed!</h2>
            <p>Your order #{{order?.orderNumber}} has been placed successfully.</p>
            <p class="method-text">Payment Method: <strong>{{ paymentMethod === 'COD' ? 'Cash On Delivery' : 'UPI Online' }}</strong></p>
            <a routerLink="/" class="btn btn-primary">Continue Shopping</a>
        </div>
      } @else if (order) {
        <div class="payment-layout">
           <div class="left-col">
              <div class="glass-panel">
                  <h3>Payment Options</h3>
                  <div class="payment-options">
                      <!-- COD OPTION -->
                      <label class="payment-card" [class.selected]="selectedMode === 'COD'">
                          <input type="radio" name="paymentMode" value="COD" [(ngModel)]="selectedMode">
                          <div class="card-content">
                              <div class="icon"><i class="fas fa-money-bill-wave"></i></div>
                              <div class="details">
                                  <h4>Cash On Delivery</h4>
                                  <p>Pay with cash upon delivery.</p>
                              </div>
                              <div class="check" *ngIf="selectedMode === 'COD'"><i class="fas fa-check-circle"></i></div>
                          </div>
                      </label>

                      <!-- UPI OPTION -->
                      <label class="payment-card" [class.selected]="selectedMode === 'UPI'">
                          <input type="radio" name="paymentMode" value="UPI" [(ngModel)]="selectedMode">
                          <div class="card-content">
                              <div class="icon"><i class="fas fa-mobile-alt"></i></div>
                              <div class="details">
                                  <h4>UPI / Online Payment</h4>
                                  <p>Google Pay, PhonePe, Paytm, BHIM</p>
                              </div>
                              <div class="check" *ngIf="selectedMode === 'UPI'"><i class="fas fa-check-circle"></i></div>
                          </div>
                      </label>
                  </div>
              </div>
           </div>

           <div class="right-col">
              <div class="summary-panel glass-panel">
                  <h3>Order Summary</h3>
                  <div class="summary-row">
                      <span>Order #</span>
                      <span>{{order.orderNumber}}</span>
                  </div>
                  <div class="summary-row">
                      <span>Items</span>
                      <span>{{order.items.length}} Items</span>
                  </div>
                  <div class="divider"></div>
                  <div class="summary-total">
                      <span>Total to Pay</span>
                      <span>₹{{order.finalAmount | number}}</span>
                  </div>
                  
                  <button class="pay-btn" [disabled]="isProcessing || !selectedMode" (click)="processPayment()">
                      {{ isProcessing ? 'Processing...' : (selectedMode === 'COD' ? 'Place Order (COD)' : 'Pay with UPI') }}
                  </button>
                  
                  <p class="secure-text"><i class="fas fa-lock"></i> 100% Secure Payment</p>
              </div>
           </div>
        </div>
      } @else {
        <div class="error-state glass-panel">
            <h3>Order Not Found</h3>
            <a routerLink="/" class="btn btn-primary">Go Home</a>
        </div>
      }
    </div>
  `,
    styles: [`
    .payment-page { padding-bottom: 50px; }
    .header-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    .back-btn { color: var(--text-main); text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
    .page-title { margin: 0; font-size: 1.8rem; color: var(--text-main); }

    .glass-panel { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    
    .loading-state, .error-state { text-align: center; padding: 3rem; font-size: 1.2rem; color: var(--text-muted); }
    
    .payment-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
    @media(min-width: 900px) { .payment-layout { grid-template-columns: 2fr 1.2fr; } }
    
    .payment-options { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
    
    .payment-card { 
        display: block; cursor: pointer; position: relative;
        border: 2px solid #e2e8f0; border-radius: 12px; transition: all 0.2s;
        overflow: hidden;
    }
    .payment-card input { position: absolute; opacity: 0; }
    .payment-card:hover { border-color: #cbd5e1; background: #f8fafc; }
    .payment-card.selected { border-color: var(--primary-color); background: #f0fdf4; box-shadow: 0 0 0 1px var(--primary-color); }
    
    .card-content { display: flex; align-items: center; padding: 1.5rem; gap: 1.5rem; }
    .icon { font-size: 1.8rem; color: var(--text-muted); width: 40px; text-align: center; }
    .payment-card.selected .icon { color: var(--primary-color); }
    
    .details h4 { margin: 0 0 0.3rem; font-size: 1.1rem; }
    .details p { margin: 0; font-size: 0.9rem; color: var(--text-muted); }
    
    .check { margin-left: auto; color: var(--primary-color); font-size: 1.5rem; }
    
    /* Summary */
    .summary-panel h3 { margin-bottom: 1.5rem; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 1rem; color: var(--text-muted); }
    .summary-total { display: flex; justify-content: space-between; font-weight: 700; font-size: 1.4rem; color: var(--text-main); margin: 1.5rem 0; }
    .divider { border-top: 1px dashed #e2e8f0; }
    
    .pay-btn {
        width: 100%; padding: 1rem; font-size: 1.1rem; font-weight: 700;
        background: var(--primary-color); color: white; border: none; border-radius: 8px;
        cursor: pointer; transition: all 0.2s;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
    }
    .pay-btn:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }
    .pay-btn:hover:not(:disabled) { transform: translateY(-2px); }
    
    .secure-text { text-align: center; margin-top: 1rem; font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; justify-content: center; gap: 0.5rem; }

    /* Success */
    .success-screen { text-align: center; padding: 4rem 2rem; max-width: 600px; margin: 0 auto; }
    .icon-circle { width: 90px; height: 90px; background: var(--success-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem; margin: 0 auto 1.5rem; }
    .method-text { margin-top: 0.5rem; margin-bottom: 2rem; color: var(--text-muted); }
  `]
})
export class PaymentComponent implements OnInit {
    orderId!: number;
    order: Order | null = null;
    isLoading = true;
    isProcessing = false;
    isSuccess = false;
    selectedMode: 'COD' | 'UPI' | '' = '';
    paymentMethod = '';

    private orderService = inject(OrderService);
    private paymentService = inject(PaymentService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    // RAZORPAY KEY ID - REPLACE WITH YOUR ACTUAL KEY
    // Since I don't have the user's key, I'll use a placeholder or ask them to change it.
    // Using a common test key for now or empty.
    private razorpayKeyId = 'rzp_test_1DP5mmOlF5G5ag';

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.orderId = +params['id'];
            if (this.orderId) {
                this.loadOrder();
            } else {
                this.isLoading = false;
            }
        });
    }

    loadOrder() {
        this.orderService.getOrderById(this.orderId).subscribe({
            next: (order) => {
                this.order = order;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    processPayment() {
        if (!this.selectedMode || !this.order) return;
        this.isProcessing = true;

        if (this.selectedMode === 'COD') {
            this.paymentService.confirmCod(this.orderId).subscribe({
                next: () => {
                    this.paymentMethod = 'COD';
                    this.isSuccess = true;
                    this.isProcessing = false;
                },
                error: (err) => {
                    console.error(err);
                    alert('Failed to place COD order.');
                    this.isProcessing = false;
                }
            });
        } else {
            // UPI
            this.paymentService.createUpiOrder(this.orderId).subscribe({
                next: (res) => {
                    this.openRazorpay(res.razorpayOrderId);
                },
                error: (err) => {
                    console.error(err);
                    alert('Failed to initiate UPI payment.');
                    this.isProcessing = false;
                }
            });
        }
    }

    openRazorpay(razorpayOrderId: string) {
        const options = {
            key: this.razorpayKeyId,
            amount: (this.order!.finalAmount * 100).toString(),
            currency: "INR",
            name: "JK Mart",
            description: "Order #" + this.order!.orderNumber,
            order_id: razorpayOrderId,
            prefill: {
                name: this.order!.customerName,
                email: this.order!.customerEmail,
                contact: this.order!.customerPhone // Ensure this is valid
            },
            theme: {
                color: "#6366f1"
            },
            handler: (response: any) => {
                this.verifyPayment(response);
            },
            modal: {
                ondismiss: () => {
                    this.isProcessing = false;
                }
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    }

    verifyPayment(response: any) {
        const data = {
            orderId: this.orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature
        };

        this.paymentService.verifyUpi(data).subscribe({
            next: () => {
                this.paymentMethod = 'UPI';
                this.isSuccess = true;
                this.isProcessing = false;
            },
            error: (err) => {
                console.error(err);
                alert('Payment verification failed.');
                this.isProcessing = false;
            }
        });
    }
}
