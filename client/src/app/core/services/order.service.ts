import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    quantityUnit: string;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Order {
    id: number;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    finalAmount: number;
    status: string;
    orderDate: string; // Renamed to match backend DTO
    address: Address;
    items: OrderItem[];
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = 'http://160.187.68.165:5001/api/orders';

    constructor(private http: HttpClient) { }

    getAllOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.apiUrl);
    }

    getOrderById(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/${id}`);
    }

    createOrder(order: any): Observable<any> {
        return this.http.post(this.apiUrl, order);
    }

    updateStatus(id: number, status: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/status`, `"${status}"`, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    deleteOrder(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
