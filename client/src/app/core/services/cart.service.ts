import { Injectable, signal, computed } from '@angular/core';
import { Product, ProductService } from './product.service';

export interface CartItem {
    product: Product;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    cartItems = signal<CartItem[]>([]);

    totalItems = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
    totalPrice = computed(() => this.cartItems().reduce((acc, item) => {
        const price = item.product.discountPrice && item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
        return acc + (price * item.quantity);
    }, 0));

    constructor(private productService: ProductService) {
        // Load from local storage
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                this.cartItems.set(JSON.parse(saved));
                this.validateCartPrices();
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
    }

    validateCartPrices() {
        this.productService.getProducts().subscribe(products => {
            const currentItems = this.cartItems();
            let updated = false;
            const verifiedItems = currentItems.map(item => {
                const freshProd = products.find(p => p.id === item.product.id);
                if (freshProd) {
                    // Check if price changed
                    if (freshProd.price !== item.product.price || freshProd.discountPrice !== item.product.discountPrice) {
                        updated = true;
                        return { ...item, product: freshProd };
                    }
                }
                return item;
            });

            if (updated) {
                this.cartItems.set(verifiedItems);
                this.saveCart();
            }
        });
    }

    addToCart(product: Product) {
        // ... (existing code)
        this.cartItems.update(items => {
            const existing = items.find(i => i.product.id === product.id);
            if (existing) {
                // IMPORTANT: Update price from the incoming product object, which is assumed to be fresh.
                return items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1, product: { ...i.product, price: product.price, discountPrice: product.discountPrice } } : i);
            }
            return [...items, { product: { ...product }, quantity: 1 }];
        });
        this.saveCart();
    }

    removeFromCart(productId: number) {
        this.cartItems.update(items => items.filter(i => i.product.id !== productId));
        this.saveCart();
    }

    updateQuantity(productId: number, quantity: number) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }
        this.cartItems.update(items => items.map(i => i.product.id === productId ? { ...i, quantity } : i));
        this.saveCart();
    }

    clearCart() {
        this.cartItems.set([]);
        this.saveCart();
    }

    private saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cartItems()));
    }
}
