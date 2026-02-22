import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

type Tab = 'dashboard' | 'users' | 'products' | 'orders';
type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// ── API shapes (matching backend DTOs) ────────────────────────────────────────

interface DashboardStats {
  totalRevenue: number;
  totalUsers: number;
  activeUsers: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface AdminProduct {
  id: number;
  name: string;
  brand: string;
  categoryName: string;
  categoryId: number;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
}

interface AdminOrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface AdminOrder {
  id: number;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  itemCount: number;
  items: AdminOrderItem[];
}

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class Admin implements OnInit {
  private readonly API = 'http://localhost:8080/api/admin';
  private readonly PRODUCTS_API = 'http://localhost:8080/api/products';         // GET (public)
  private readonly ADMIN_PRODUCTS_API = 'http://localhost:8080/api/admin/products'; // POST/PUT/DELETE (admin)
  private readonly CATEGORIES_API = 'http://localhost:8080/api/categories';

  activeTab: Tab = 'dashboard';
  isLoading = false;

  // ── Dashboard ────────────────────────────────────────────────────────────────
  stats: DashboardStats = {
    totalRevenue: 0, totalUsers: 0, activeUsers: 0,
    totalProducts: 0, totalOrders: 0, pendingOrders: 0,
  };

  // ── Users ─────────────────────────────────────────────────────────────────────
  users: AdminUser[] = [];
  userSearch = '';
  showUserModal = false;
  editingUserId: number | null = null;
  newUser = { name: '', email: '', role: 'CUSTOMER', status: 'ACTIVE' };

  get filteredUsers(): AdminUser[] {
    const q = this.userSearch.toLowerCase();
    return this.users.filter(u =>
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  // ── Products ──────────────────────────────────────────────────────────────────
  products: AdminProduct[] = [];
  categories: Category[] = [];
  productSearch = '';
  showProductModal = false;
  editingProductId: number | null = null;
  newProduct = { name: '', brand: '', description: '', price: 0, stock: 0, imageUrl: '', categoryId: 0 };

  get filteredProducts(): AdminProduct[] {
    const q = this.productSearch.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }

  // ── Orders ────────────────────────────────────────────────────────────────────
  orders: AdminOrder[] = [];
  orderSearch = '';
  showOrderModal = false;
  orderStatuses: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  get filteredOrders(): AdminOrder[] {
    const q = this.orderSearch.toLowerCase();
    return this.orders.filter(o =>
      String(o.id).includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q)
    );
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────────

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.loadUsers();
    this.loadProducts();
    this.loadOrders();
    this.loadCategories();
  }

  setTab(tab: Tab): void {
    this.activeTab = tab;
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────────

  loadDashboard(): void {
    this.http.get<DashboardStats>(`${this.API}/dashboard/stats`).subscribe({
      next: stats => (this.stats = stats),
    });
  }

  // ── Users ─────────────────────────────────────────────────────────────────────

  loadUsers(): void {
    this.http.get<AdminUser[]>(`${this.API}/users`).subscribe({
      next: users => (this.users = users),
    });
  }

  openUserModal(user?: AdminUser): void {
    if (user) {
      this.editingUserId = user.id;
      this.newUser = { name: user.name, email: user.email, role: user.role, status: user.status };
    } else {
      this.editingUserId = null;
      this.newUser = { name: '', email: '', role: 'CUSTOMER', status: 'ACTIVE' };
    }
    this.showUserModal = true;
  }

  saveUser(): void {
    if (!this.newUser.name.trim() || !this.newUser.email.trim()) {
      alert('Name and Email are required.');
      return;
    }

    if (this.editingUserId !== null) {
      this.http.put<AdminUser>(`${this.API}/users/${this.editingUserId}`, this.newUser).subscribe({
        next: updated => {
          this.users = this.users.map(u => u.id === updated.id ? updated : u);
          this.showUserModal = false;
        },
        error: () => alert('Failed to update user.'),
      });
    } else {
      // No "create user" endpoint on backend — notify and close
      alert('Creating users directly from admin is not supported. Users register via the login page.');
      this.showUserModal = false;
    }
  }

  toggleUserStatus(user: AdminUser): void {
    this.http.patch(`${this.API}/users/${user.id}/toggle-status`, {}).subscribe({
      next: () => {
        user.status = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      },
      error: () => alert('Failed to toggle user status.'),
    });
  }

  deleteUser(id: number): void {
    if (!confirm('Delete this user?')) return;
    this.http.delete(`${this.API}/users/${id}`).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        this.loadDashboard();
      },
      error: () => alert('Failed to delete user.'),
    });
  }

  // ── Products ──────────────────────────────────────────────────────────────────

  loadProducts(): void {
    this.http.get<AdminProduct[]>(this.PRODUCTS_API).subscribe({
      next: products => (this.products = products),
    });
  }

  loadCategories(): void {
    this.http.get<Category[]>(this.CATEGORIES_API).subscribe({
      next: cats => {
        this.categories = cats;
        if (cats.length > 0 && this.newProduct.categoryId === 0) {
          this.newProduct.categoryId = cats[0].id;
        }
      },
    });
  }

  openProductModal(product?: AdminProduct): void {
    if (product) {
      this.editingProductId = product.id;
      this.newProduct = {
        name: product.name,
        brand: product.brand,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        categoryId: product.categoryId,
      };
    } else {
      this.editingProductId = null;
      this.newProduct = {
        name: '', brand: '', description: '', price: 0, stock: 0,
        imageUrl: '', categoryId: this.categories[0]?.id ?? 0,
      };
    }
    this.showProductModal = true;
  }

  saveProduct(): void {
    if (!this.newProduct.name.trim() || !this.newProduct.brand.trim()) {
      alert('Name and Brand are required.');
      return;
    }

    const payload = { ...this.newProduct };

    if (this.editingProductId !== null) {
      this.http.put<AdminProduct>(`${this.ADMIN_PRODUCTS_API}/${this.editingProductId}`, payload).subscribe({
        next: updated => {
          this.products = this.products.map(p => p.id === updated.id ? updated : p);
          this.showProductModal = false;
          this.loadDashboard();
        },
        error: () => alert('Failed to update product.'),
      });
    } else {
      this.http.post<AdminProduct>(this.ADMIN_PRODUCTS_API, payload).subscribe({
        next: created => {
          this.products = [...this.products, created];
          this.showProductModal = false;
          this.loadDashboard();
        },
        error: () => alert('Failed to create product.'),
      });
    }
  }

  deleteProduct(id: number): void {
    if (!confirm('Delete this product?')) return;
    this.http.delete(`${this.ADMIN_PRODUCTS_API}/${id}`).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
        this.loadDashboard();
      },
      error: () => alert('Failed to delete product.'),
    });
  }

  stockLabel(stock: number): string {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 10) return 'Low Stock';
    return 'In Stock';
  }

  stockClass(stock: number): string {
    if (stock === 0) return 'badge-danger';
    if (stock <= 10) return 'badge-warning';
    return 'badge-success';
  }

  // ── Orders ────────────────────────────────────────────────────────────────────

  loadOrders(): void {
    this.http.get<AdminOrder[]>(`${this.API}/orders`).subscribe({
      next: orders => (this.orders = orders),
    });
  }

  // Tracks the dropdown selection independently from confirmed order.status
  pendingStatus: { [orderId: number]: string } = {};

  getDisplayStatus(order: AdminOrder): string {
    return this.pendingStatus[order.id] ?? order.status;
  }

  onStatusChange(order: AdminOrder, newStatus: string): void {
    const previous = this.pendingStatus[order.id] ?? order.status;
    this.pendingStatus[order.id] = newStatus;

    this.http.patch<AdminOrder>(`${this.API}/orders/${order.id}/status`, { status: newStatus }).subscribe({
      next: updated => {
        this.orders = this.orders.map(o => o.id === updated.id ? updated : o);
        delete this.pendingStatus[order.id];
        this.loadDashboard();
      },
      error: () => {
        alert('Failed to update order status.');
        this.pendingStatus[order.id] = previous;
      },
    });
  }

  updateOrderStatus(order: AdminOrder, status: string): void {
    this.onStatusChange(order, status);
  }

  deleteOrder(id: number): void {
    if (!confirm(`Delete order #${id}?`)) return;
    this.http.delete(`${this.API}/orders/${id}`).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o.id !== id);
        this.loadDashboard();
      },
      error: () => alert('Failed to delete order.'),
    });
  }

  // Note: "Create Order" is handled by the checkout flow, not the admin panel.
  openOrderModal(): void {
    alert('Orders are created by customers via the checkout flow. Use the status dropdown to manage existing orders.');
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'badge-warning', PROCESSING: 'badge-info',
      SHIPPED: 'badge-primary', DELIVERED: 'badge-success', CANCELLED: 'badge-danger',
    };
    return map[status] ?? 'badge-info';
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-MY', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  get userModalTitle(): string { return this.editingUserId ? 'Edit User' : 'Create User'; }
  get productModalTitle(): string { return this.editingProductId ? 'Edit Product' : 'Create Product'; }
  get userSaveLabel(): string { return this.editingUserId ? 'Save Changes' : 'Create User'; }
  get productSaveLabel(): string { return this.editingProductId ? 'Save Changes' : 'Create Product'; }
}
