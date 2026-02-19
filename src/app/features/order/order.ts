import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { CartService, CartItem } from '../../services/cart-service';

@Component({
    selector: 'app-order',
    standalone: true,
    imports: [CommonModule, RouterModule, Header, Footer],
    templateUrl: './order.html',
    styleUrls: ['./order.css'],
})
export class Order implements OnInit {
    private cartService = inject(CartService);

    orderId = 'ORD-20240219-00142';
    orderDate = new Date().toLocaleDateString('en-MY', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    // Simulated checkout form data
    shippingInfo = {
        fullName: 'John Doe',
        phone: '0123456789',
        email: 'johndoe@email.com',
        address1: '123 Jalan Utama',
        address2: 'Taman Maju',
        postalCode: '47500',
        city: 'Petaling Jaya',
        state: 'Selangor',
        country: 'Malaysia',
    };

    deliveryMode: 'deliver' | 'pickup' = 'deliver';
    shippingFee = 50;
    items: CartItem[] = [];

    ngOnInit(): void {
        this.cartService.items$.subscribe((items) => (this.items = items));
    }

    get subtotal(): number { return this.cartService.subtotal; }
    get tax(): number { return this.subtotal * 0.08; }
    get total(): number {
        return this.deliveryMode === 'deliver'
            ? this.subtotal + this.shippingFee
            : this.subtotal;
    }
}