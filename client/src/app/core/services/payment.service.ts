import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = 'http://160.187.68.165:5001/api/payment';

    constructor(private http: HttpClient) { }

    createUpiOrder(orderId: number): Observable<{ razorpayOrderId: string }> {
        return this.http.post<{ razorpayOrderId: string }>(`${this.apiUrl}/create-upi-order`, { orderId });
    }

    verifyUpi(data: { orderId: number, razorpayPaymentId: string, razorpayOrderId: string, razorpaySignature: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/verify-upi`, data);
    }

    confirmCod(orderId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/confirm-cod`, { orderId });
    }
}
