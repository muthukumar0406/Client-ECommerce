import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../core/services/category.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-admin-categories',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-header">
        <h2>Manage Categories</h2>
        <button class="btn btn-primary" (click)="openModal()">
            <i class="fas fa-plus"></i> Add Category
        </button>
    </div>

    <div class="grid">
        @for (cat of categories(); track cat.id) {
            <div class="cat-card glass-panel">
                <div class="cat-info">
                    <h3>{{cat.name}}</h3>
                    <p>{{cat.description || 'No description'}}</p>
                </div>
                <div class="cat-actions">
                    <button class="btn-icon" (click)="editCategory(cat)"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete" (click)="deleteCategory(cat.id)"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        }
    </div>

    <!-- Modal -->
    <div class="modal-backdrop" *ngIf="showModal">
        <div class="modal glass-panel">
            <h3>{{ isEditing ? 'Edit Category' : 'Add New Category' }}</h3>
            <form (ngSubmit)="saveCategory()">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" [(ngModel)]="currentCategory.name" name="name" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea [(ngModel)]="currentCategory.description" name="description"></textarea>
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
    
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
    
    .cat-card {
        padding: 1.5rem;
        background: white;
        border-radius: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .cat-info h3 { margin: 0 0 0.5rem; font-size: 1.1rem; }
    .cat-info p { margin: 0; color: var(--text-muted); font-size: 0.9rem; }
    
    .cat-actions { display: flex; gap: 0.5rem; }
    .btn-icon {
        width: 32px; height: 32px; border-radius: 50%; border: none;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: all 0.2s;
        background: #f1f5f9; color: var(--text-muted);
    }
    .btn-icon:hover { background: var(--primary-color); color: white; }
    .btn-icon.delete:hover { background: var(--danger-color); color: white; }
    
    /* Modal */
    .modal-backdrop {
        position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1100;
        display: flex; align-items: center; justify-content: center;
        padding: 1rem;
    }
    .modal {
        background: white; width: 100%; max-width: 500px; padding: 2rem; border-radius: 12px;
        max-height: 90vh; overflow-y: auto;
    }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-group input, .form-group textarea { width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid #e2e8f0; }
    
    .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; }
    .btn:disabled { opacity: 0.7; cursor: not-allowed; }
  `]
})
export class AdminCategoriesComponent implements OnInit {
    categories = signal<Category[]>([]);
    showModal = false;
    isEditing = false;
    isSaving = false;
    currentCategory: any = { name: '', description: '' };

    private apiUrl = 'http://160.187.68.165:5001/api/categories';

    constructor(
        private categoryService: CategoryService,
        private http: HttpClient
    ) { }

    ngOnInit() {
        this.loadCategories();
    }

    loadCategories() {
        this.categoryService.getCategories().subscribe({
            next: (res) => this.categories.set(res),
            error: (err) => console.error('Failed to load categories', err)
        });
    }

    openModal() {
        this.showModal = true;
        this.isEditing = false;
        this.currentCategory = { name: '', description: '' };
    }

    closeModal() {
        this.showModal = false;
    }

    editCategory(cat: Category) {
        this.isEditing = true;
        this.currentCategory = { ...cat };
        this.showModal = true;
    }

    saveCategory() {
        if (!this.currentCategory.name) {
            alert('Category Name is required');
            return;
        }

        this.isSaving = true;
        console.log('Saving Category...', this.currentCategory);

        const request = this.isEditing
            ? this.http.put(`${this.apiUrl}/${this.currentCategory.id}`, this.currentCategory)
            : this.http.post(this.apiUrl, this.currentCategory);

        request.subscribe({
            next: () => {
                console.log('Category saved successfully');
                this.loadCategories();
                this.closeModal();
                this.isSaving = false;
            },
            error: (err) => {
                console.error('Error saving category:', err);
                alert('Failed to save category. See console for details.');
                this.isSaving = false;
            }
        });
    }

    deleteCategory(id: number) {
        if (confirm('Are you sure you want to delete this category?')) {
            this.http.delete(`${this.apiUrl}/${id}`).subscribe({
                next: () => this.loadCategories(),
                error: (err) => console.error('Delete failed', err)
            });
        }
    }
}
