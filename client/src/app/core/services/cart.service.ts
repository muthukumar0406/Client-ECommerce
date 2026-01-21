import { Injectable, signal, computed } from '@angular/core';
import { Product } from './product.service';

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
    totalPrice = computed(() => this.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0));

    constructor() {
        // Load from local storage
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                this.cartItems.set(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
    }

    addToCart(product: Product) {
        this.cartItems.update(items => {
            const existing = items.find(i => i.product.id === product.id);
            if (existing) {
                return items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...items, { product, quantity: 1 }];
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
