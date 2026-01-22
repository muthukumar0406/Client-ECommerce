import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    stockQuantity: number;
    sku: string;
    categoryId: number;
    imageUrls: string[];
    quantityUnit: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://160.187.68.165:5001/api/products';

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
    }

    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    searchProducts(query: string): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/search?q=${query}`);
    }

    createProduct(product: Product): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product);
    }
}
