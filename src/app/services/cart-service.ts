import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
    id: number;
    name: string;
    brand: string;
    type: string;
    price: number;
    image: string;
    quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
    private itemsSubject = new BehaviorSubject<CartItem[]>([
        {
            id: 1, name: 'Logitech Keyboard', brand: 'Logitech', type: 'Keyboard', price: 99.99, image: 'assets/logitech-keyboard.webp', quantity: 2,
        },
        {
            id: 2, name: 'Dell Monitor', brand: 'Dell', type: 'Monitor', price: 199.99, image: 'assets/dell-monitor.webp', quantity: 1,
        },
        {
            id: 3, name: 'Asus Laptop', brand: 'Asus', type: 'Laptop', price: 899.99, image: 'assets/asus-laptop.webp', quantity: 3,
        },
    ]);

    items$ = this.itemsSubject.asObservable();

    get items(): CartItem[] {
        return this.itemsSubject.getValue();
    }

    addItem(product: { id: number; name: string; brand: string; type: string; price: number; image: string }, quantity: number): void {
        const existing = this.items.find(i => i.id === product.id);
        if (existing) {
            this.updateQuantity(product.id, existing.quantity + quantity);
        } else {
            this.itemsSubject.next([...this.items, { ...product, quantity }]);
        }
    }

    updateQuantity(itemId: number, quantity: number): void {
        this.itemsSubject.next(
            this.items.map((i) => (i.id === itemId ? { ...i, quantity } : i))
        );
    }

    removeItem(itemId: number): void {
        this.itemsSubject.next(this.items.filter((i) => i.id !== itemId));
    }

    clearCart(): void {
        this.itemsSubject.next([]);
    }

    get subtotal(): number {
        return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    }
}