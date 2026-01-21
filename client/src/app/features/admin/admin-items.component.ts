import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../core/services/product.service';
import { CategoryService, Category } from '../../core/services/category.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-admin-items',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-header">
        <h2>Add / Manage Items</h2>
        <button class="btn btn-primary" (click)="openModal()">
            <i class="fas fa-plus"></i> Add Item
        </button>
    </div>

    <!-- Inventory Table -->
    <div class="glass-panel table-container">
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @for (prod of products(); track prod.id) {
                    <tr>
                            <img [src]="prod.imageUrls[0] || 'assets/placeholder.png'" class="table-img">
                        <td>{{prod.name}}</td>
                        <td>{{getCategoryName(prod.categoryId)}}</td>
                        <td>
                            <div class="price-col">
                                <span class="old" *ngIf="prod.discountPrice && prod.price > prod.discountPrice">₹{{prod.price}}</span>
                                <span class="new">₹{{prod.discountPrice || prod.price}}</span>
                            </div>
                        </td>
                        <td>
                            <span class="stock-badge" [class.out]="prod.stockQuantity <= 0">
                                {{prod.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}}
                            </span>
                        </td>
                        <td>
                            <div class="actions">
                                <button class="btn-icon" (click)="editProduct(prod)"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon delete" (click)="deleteProduct(prod.id)"><i class="fas fa-trash"></i></button>
                                <button class="btn-sm" (click)="toggleStock(prod)">
                                    {{prod.stockQuantity > 0 ? 'Mark OOS' : 'Restock'}}
                                </button>
                            </div>
                        </td>
                    </tr>
                }
            </tbody>
        </table>
    </div>

    <!-- Modal -->
    <div class="modal-backdrop" *ngIf="showModal">
        <div class="modal glass-panel">
            <h3>{{ isEditing ? 'Edit Item' : 'Add New Item' }}</h3>
            <form (ngSubmit)="saveProduct()">
                <div class="form-row">
                    <div class="form-group half">
                        <label>Item Name</label>
                        <input type="text" [(ngModel)]="currentProduct.name" name="name" required>
                    </div>
                     <div class="form-group half">
                        <label>Category</label>
                        <select [(ngModel)]="currentProduct.categoryId" name="categoryId" required>
                            <option *ngFor="let cat of categories()" [value]="cat.id">{{cat.name}}</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group half">
                        <label>Original Price</label>
                        <input type="number" [(ngModel)]="currentProduct.price" name="price" required>
                    </div>
                    <div class="form-group half">
                        <label>Discount Price</label>
                        <input type="number" [(ngModel)]="currentProduct.discountPrice" name="discountPrice">
                    </div>
                </div>

                <div class="form-group">
                    <label>Product Image</label>
                    <div class="image-upload">
                        <input type="file" (change)="onFileSelected($event)" accept="image/*">
                        <img *ngIf="imageUrlInput" [src]="imageUrlInput" style="height: 50px; margin-left: 1rem; border-radius: 4px;">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Description</label>
                    <textarea [(ngModel)]="currentProduct.description" name="description"></textarea>
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn btn-outline" (click)="closeModal()" [disabled]="isSaving">Cancel</button>
                    <button type="submit" class="btn btn-primary" [disabled]="isSaving">
                        {{ isSaving ? 'Saving...' : 'Save' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
  `,
    styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    
    .table-container { overflow-x: auto; padding: 0; }
    table { width: 100%; border-collapse: collapse; min-width: 600px; }
    th { text-align: left; padding: 1rem; background: #f8fafc; color: var(--text-muted); font-weight: 600; }
    td { padding: 1rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    
    .table-img { width: 50px; height: 50px; object-fit: cover; border-radius: 8px; background: #f1f5f9; }
    
    .price-col { display: flex; flex-direction: column; font-size: 0.9rem; }
    .price-col .old { text-decoration: line-through; color: var(--text-muted); font-size: 0.8rem; }
    .price-col .new { font-weight: 600; color: var(--text-main); }
    
    .stock-badge { padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; background: #dcfce7; color: #166534; }
    .stock-badge.out { background: #fee2e2; color: #991b1b; }
    
    .actions { display: flex; align-items: center; gap: 0.5rem; }
    .btn-icon { width: 30px; height: 30px; border-radius: 4px; border: 1px solid #e2e8f0; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
    .btn-icon:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .btn-icon.delete:hover { border-color: var(--danger-color); color: var(--danger-color); }
    
    .btn-sm { padding: 0.25rem 0.5rem; font-size: 0.75rem; border: 1px solid #e2e8f0; background: white; border-radius: 4px; cursor: pointer; }
    
    /* Modal */
    .modal-backdrop { 
        position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1100; 
        display: flex; align-items: center; justify-content: center; 
        padding: 1rem;
    }
    .modal { 
        background: white; width: 100%; max-width: 600px; padding: 2rem; border-radius: 12px; 
        max-height: 90vh; overflow-y: auto;
    }
    
    .form-row { display: flex; gap: 1rem; }
    .half { flex: 1; }
    
    @media (max-width: 600px) {
        .form-row { flex-direction: column; gap: 0; }
        .modal { padding: 1.5rem; }
    }

    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid #e2e8f0; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
    .btn:disabled { opacity: 0.7; cursor: not-allowed; }
  `]
})
export class AdminItemsComponent implements OnInit {
    products = signal<Product[]>([]);
    categories = signal<Category[]>([]);

    showModal = false;
    isEditing = false;
    isSaving = false;
    currentProduct: any = {};
    imageUrlInput = '';
    selectedFile: File | null = null;

    private apiUrl = 'http://160.187.68.165:5001/api/products';

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private http: HttpClient
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.productService.getProducts().subscribe({
            next: (res) => this.products.set(res),
            error: (err) => console.error('Error loading products', err)
        });
        this.categoryService.getCategories().subscribe({
            next: (res) => this.categories.set(res),
            error: (err) => console.error('Error loading categories', err)
        });
    }

    getCategoryName(id: number): string {
        return this.categories().find(c => c.id === id)?.name || 'Unknown';
    }

    openModal() {
        this.showModal = true;
        this.isEditing = false;
        // Default to first category if available
        const firstCatId = this.categories().length > 0 ? this.categories()[0].id : null;
        this.currentProduct = {
            name: '', description: '', price: 0, discountPrice: 0,
            stockQuantity: 100, categoryId: firstCatId
        };
        this.imageUrlInput = '';
    }

    closeModal() {
        this.showModal = false;
    }

    editProduct(prod: Product) {
        this.isEditing = true;
        this.currentProduct = { ...prod };
        this.imageUrlInput = prod.imageUrls?.[0] || '';
        this.showModal = true;
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            // Preview
            const reader = new FileReader();
            reader.onload = () => {
                this.imageUrlInput = reader.result as string; // For preview only
            };
            reader.readAsDataURL(file);
        }
    }

    saveProduct() {
        if (!this.currentProduct.name || !this.currentProduct.price) {
            alert('Name and Price are required.');
            return;
        }

        this.isSaving = true;
        console.log('Saving Product with Image...', this.selectedFile?.name);

        const formData = new FormData();
        formData.append('Name', this.currentProduct.name);
        formData.append('Price', this.currentProduct.price.toString());
        formData.append('Description', this.currentProduct.description || '');
        formData.append('DiscountPrice', (this.currentProduct.discountPrice || 0).toString());
        formData.append('StockQuantity', (this.currentProduct.stockQuantity || 0).toString());
        formData.append('CategoryId', this.currentProduct.categoryId.toString());
        formData.append('Sku', this.currentProduct.sku || ('SKU-' + Date.now()));

        // If editing
        if (this.isEditing) {
            formData.append('Id', this.currentProduct.id.toString());
        }

        if (this.selectedFile) {
            formData.append('Image', this.selectedFile);
        }

        // We use the same API URL. Backend expects FromForm.
        const request = this.isEditing
            ? this.http.put(`${this.apiUrl}/${this.currentProduct.id}`, formData)
            : this.http.post(this.apiUrl, formData);

        request.subscribe({
            next: () => {
                console.log('Product saved successfully');
                this.loadData();
                this.closeModal();
                this.isSaving = false;
                this.selectedFile = null;
            },
            error: (err) => {
                console.error('Error saving product:', err);
                alert('Failed to save product. See console.');
                this.isSaving = false;
            }
        });
    }

    deleteProduct(id: number) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.http.delete(`${this.apiUrl}/${id}`).subscribe({
                next: () => this.loadData(),
                error: (err) => console.error('Delete failed', err)
            });
        }
    }

    toggleStock(prod: Product) {
        const newStock = prod.stockQuantity > 0 ? 0 : 100;
        const updated = { ...prod, stockQuantity: newStock };
        // Using PUT for simplicity
        this.http.put(`${this.apiUrl}/${prod.id}`, updated).subscribe({
            next: () => this.loadData(),
            error: (err) => console.error('Stock update failed', err)
        });
    }
}
