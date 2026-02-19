import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Tab = 'dashboard' | 'users' | 'products' | 'orders';
type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'Admin' | 'Customer';
    status: 'Active' | 'Inactive';
    joined: string;
}

interface AdminProduct {
    id: number;
    name: string;
    brand: string;
    type: string;
    price: number;
    stock: number;
}

interface Order {
    id: string;
    customer: string;
    date: string;
    total: number;
    status: OrderStatus;
    items: number;
}

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin.html',
    styleUrls: ['./admin.css'],
})
export class Admin {
    activeTab: Tab = 'dashboard';

    // ── Modal State ─────────────────────────────────────
    showUserModal = false;
    showProductModal = false;
    showOrderModal = false;

    editingUserId: number | null = null;
    editingProductId: number | null = null;

    // ── Forms ───────────────────────────────────────────
    newUser: Omit<User, 'id'> = { name: '', email: '', role: 'Customer', status: 'Active', joined: '' };
    newProduct: Omit<AdminProduct, 'id'> = { name: '', brand: '', type: '', price: 0, stock: 0 };
    newOrder: Omit<Order, 'id'> = { customer: '', date: '', total: 0, status: 'Pending', items: 1 };

    // ── Users ───────────────────────────────────────────
    users: User[] = [
        { id: 1, name: 'Alice Tan', email: 'alice@email.com', role: 'Admin', status: 'Active', joined: '2024-01-10' },
        { id: 2, name: 'Bob Lim', email: 'bob@email.com', role: 'Customer', status: 'Active', joined: '2024-02-14' },
        { id: 3, name: 'Chloe Wong', email: 'chloe@email.com', role: 'Customer', status: 'Inactive', joined: '2024-03-05' },
        { id: 4, name: 'David Ng', email: 'david@email.com', role: 'Customer', status: 'Active', joined: '2024-04-22' },
        { id: 5, name: 'Eva Chong', email: 'eva@email.com', role: 'Customer', status: 'Active', joined: '2024-05-18' },
    ];
    userSearch = '';

    get filteredUsers(): User[] {
        return this.users.filter(u =>
            u.name.toLowerCase().includes(this.userSearch.toLowerCase()) ||
            u.email.toLowerCase().includes(this.userSearch.toLowerCase())
        );
    }

    openUserModal(user?: User): void {
        if (user) {
            this.editingUserId = user.id;
            this.newUser = { name: user.name, email: user.email, role: user.role, status: user.status, joined: user.joined };
        } else {
            this.editingUserId = null;
            this.newUser = { name: '', email: '', role: 'Customer', status: 'Active', joined: new Date().toISOString().split('T')[0] };
        }
        this.showUserModal = true;
    }

    saveUser(): void {
        if (!this.newUser.name.trim() || !this.newUser.email.trim()) {
            alert('Name and Email are required.');
            return;
        }
        if (this.editingUserId !== null) {
            this.users = this.users.map(u =>
                u.id === this.editingUserId ? { id: u.id, ...this.newUser } : u
            );
        } else {
            const id = Math.max(...this.users.map(u => u.id), 0) + 1;
            this.users = [...this.users, { id, ...this.newUser }];
        }
        this.showUserModal = false;
    }

    toggleUserStatus(user: User): void {
        user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    }

    deleteUser(id: number): void {
        if (confirm('Delete this user?')) this.users = this.users.filter(u => u.id !== id);
    }

    // ── Products ────────────────────────────────────────
    products: AdminProduct[] = [
        { id: 1, name: 'Logitech Keyboard', brand: 'Logitech', type: 'Keyboard', price: 99.99, stock: 45 },
        { id: 2, name: 'Dell Monitor', brand: 'Dell', type: 'Monitor', price: 199.99, stock: 12 },
        { id: 3, name: 'Asus Laptop', brand: 'Asus', type: 'Laptop', price: 899.99, stock: 8 },
        { id: 4, name: 'Asus Keyboard', brand: 'Asus', type: 'Keyboard', price: 59.99, stock: 30 },
        { id: 5, name: 'Razer Mouse', brand: 'Razer', type: 'Mouse', price: 79.99, stock: 0 },
    ];
    productSearch = '';

    get filteredProducts(): AdminProduct[] {
        return this.products.filter(p =>
            p.name.toLowerCase().includes(this.productSearch.toLowerCase()) ||
            p.brand.toLowerCase().includes(this.productSearch.toLowerCase())
        );
    }

    openProductModal(product?: AdminProduct): void {
        if (product) {
            this.editingProductId = product.id;
            this.newProduct = { name: product.name, brand: product.brand, type: product.type, price: product.price, stock: product.stock };
        } else {
            this.editingProductId = null;
            this.newProduct = { name: '', brand: '', type: '', price: 0, stock: 0 };
        }
        this.showProductModal = true;
    }

    saveProduct(): void {
        if (!this.newProduct.name.trim() || !this.newProduct.brand.trim()) {
            alert('Name and Brand are required.');
            return;
        }
        if (this.editingProductId !== null) {
            this.products = this.products.map(p =>
                p.id === this.editingProductId ? { id: p.id, ...this.newProduct } : p
            );
        } else {
            const id = Math.max(...this.products.map(p => p.id), 0) + 1;
            this.products = [...this.products, { id, ...this.newProduct }];
        }
        this.showProductModal = false;
    }

    deleteProduct(id: number): void {
        if (confirm('Delete this product?')) this.products = this.products.filter(p => p.id !== id);
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

    // ── Orders ──────────────────────────────────────────
    orders: Order[] = [
        { id: 'ORD-001', customer: 'Bob Lim', date: '2024-06-01', total: 399.97, status: 'Delivered', items: 3 },
        { id: 'ORD-002', customer: 'Chloe Wong', date: '2024-06-05', total: 199.99, status: 'Shipped', items: 1 },
        { id: 'ORD-003', customer: 'David Ng', date: '2024-06-10', total: 899.99, status: 'Processing', items: 1 },
        { id: 'ORD-004', customer: 'Eva Chong', date: '2024-06-12', total: 159.98, status: 'Pending', items: 2 },
        { id: 'ORD-005', customer: 'Bob Lim', date: '2024-06-15', total: 79.99, status: 'Cancelled', items: 1 },
    ];
    orderSearch = '';
    orderStatuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    get filteredOrders(): Order[] {
        return this.orders.filter(o =>
            o.id.toLowerCase().includes(this.orderSearch.toLowerCase()) ||
            o.customer.toLowerCase().includes(this.orderSearch.toLowerCase())
        );
    }

    openOrderModal(): void {
        this.newOrder = { customer: '', date: new Date().toISOString().split('T')[0], total: 0, status: 'Pending', items: 1 };
        this.showOrderModal = true;
    }

    saveOrder(): void {
        if (!this.newOrder.customer.trim()) { alert('Customer name is required.'); return; }
        const nextNum = this.orders.length + 1;
        const id = `ORD-${String(nextNum).padStart(3, '0')}`;
        this.orders = [...this.orders, { id, ...this.newOrder }];
        this.showOrderModal = false;
    }

    deleteOrder(id: string): void {
        if (confirm(`Delete order ${id}?`)) this.orders = this.orders.filter(o => o.id !== id);
    }

    updateOrderStatus(order: Order, status: string): void {
        order.status = status as OrderStatus;
    }

    statusClass(status: OrderStatus): string {
        const map: Record<OrderStatus, string> = {
            Pending: 'badge-warning', Processing: 'badge-info',
            Shipped: 'badge-primary', Delivered: 'badge-success', Cancelled: 'badge-danger',
        };
        return map[status];
    }

    // ── Dashboard ───────────────────────────────────────
    get totalRevenue(): number {
        return this.orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.total, 0);
    }
    get activeUsers(): number { return this.users.filter(u => u.status === 'Active').length; }
    get pendingOrders(): number {
        return this.orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
    }
    setTab(tab: Tab): void { this.activeTab = tab; }

    get userModalTitle(): string { return this.editingUserId ? 'Edit User' : 'Create User'; }
    get productModalTitle(): string { return this.editingProductId ? 'Edit Product' : 'Create Product'; }
    get userSaveLabel(): string { return this.editingUserId ? 'Save Changes' : 'Create User'; }
    get productSaveLabel(): string { return this.editingProductId ? 'Save Changes' : 'Create Product'; }
}