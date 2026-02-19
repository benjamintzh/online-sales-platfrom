import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { CartService, CartItem } from '../../services/cart-service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, Header, Footer],
    templateUrl: './cart.html',
    styleUrls: ['./cart.css'],
})
export class Cart implements OnInit {
    private cartService = inject(CartService);
    items: CartItem[] = [];

    ngOnInit(): void {
        this.cartService.items$.subscribe((items) => (this.items = items));
    }

    updateQuantity(itemId: number, event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = parseInt(input.value, 10);
        this.cartService.updateQuantity(itemId, !isNaN(value) && value >= 1 ? value : 1);
    }

    increment(item: CartItem): void {
        this.cartService.updateQuantity(item.id, item.quantity + 1);
    }

    decrement(item: CartItem): void {
        if (item.quantity > 1) this.cartService.updateQuantity(item.id, item.quantity - 1);
    }

    removeItem(itemId: number): void {
        this.cartService.removeItem(itemId);
    }

    clearCart(): void {
        this.cartService.clearCart();
    }

    get subtotal(): number { return this.cartService.subtotal; }
    get tax(): number { return this.subtotal * 0.08; }
    get total(): number { return this.subtotal + this.tax; }
}