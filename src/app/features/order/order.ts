import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  orderId = '';
  orderDate = new Date().toLocaleDateString('en-MY', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  shippingInfo = {
    fullName: '',
    phone: '',
    email: '',
    address1: '',
    address2: '',
    postalCode: '',
    city: '',
    state: '',
    country: '',
  };

  deliveryMode: 'deliver' | 'pickup' = 'deliver';
  shippingFee = 50;
  items: CartItem[] = [];

  private isBrowser: boolean;

  constructor(
    private cartService: CartService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Read order data saved by Checkout before calling the API
    const rawShipping = sessionStorage.getItem('shippingInfo');
    if (rawShipping) {
      this.shippingInfo = JSON.parse(rawShipping);
    }

    const mode = sessionStorage.getItem('deliveryMode');
    if (mode === 'pickup' || mode === 'deliver') {
      this.deliveryMode = mode;
    }

    const orderId = sessionStorage.getItem('orderId');
    this.orderId = orderId ? `ORD-${orderId}` : '';

    // The cart has been cleared by the backend after checkout,
    // so we snapshot the items from the service's current state
    // before it refreshes (or use the last known items).
    this.cartService.items$.subscribe(items => {
      if (items.length > 0) {
        this.items = items;
      }
    });

    // Clean up sessionStorage
    sessionStorage.removeItem('shippingInfo');
    sessionStorage.removeItem('deliveryMode');
    sessionStorage.removeItem('orderId');
  }

  get subtotal(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  get tax(): number { return this.subtotal * 0.08; }

  get total(): number {
    return this.deliveryMode === 'deliver'
      ? this.subtotal + this.shippingFee
      : this.subtotal;
  }
}
