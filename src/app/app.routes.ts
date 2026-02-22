import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from './features/cart/cart';
import { Checkout } from './features/checkout/checkout';
import { Payment } from './features/payment/payment';
import { PaymentStatus } from './features/payment/payment-status';
import { Order } from './features/order/order';
import { Admin } from './features/admin/admin';
import { authGuard } from './core/auth/auth.guard';
import { AuthService } from './core/auth/auth.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/products').then((m) => m.Products),
  },
  {
    path: 'products/:brand',
    loadComponent: () => import('./features/products/products').then((m) => m.Products),
  },
  {
    path: 'products/:brand/:id',
    loadComponent: () => import('./features/view-product/view-product').then((m) => m.ViewProduct),
  },
  {
    path: 'aboutus',
    loadComponent: () => import('./features/about-us/about-us').then((m) => m.AboutUs),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: 'cart',
    component: Cart,
    canActivate: [authGuard],
  },
  {
    path: 'checkout',
    component: Checkout,
    canActivate: [authGuard],
  },
  {
    path: 'payment',
    component: Payment,
    canActivate: [authGuard],
  },
  {
    path: 'payment/status',
    component: PaymentStatus,
    canActivate: [authGuard],
  },
  {
    path: 'order',
    component: Order,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [() => {
      const auth = inject(AuthService);
      const router = inject(Router);
      if (auth.isLoggedIn() && auth.isAdmin()) return true;
      router.navigate(['/']);
      return false;
    }],
  },
];
