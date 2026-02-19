import { Routes } from '@angular/router';
import { Cart } from './features/cart/cart';
import { Checkout } from './features/checkout/checkout';
import { Payment } from './features/payment/payment';
import { PaymentStatus } from './features/payment/payment-status';
import { Order } from './features/order/order';
import { Admin } from './features/admin/admin'


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
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: 'cart',
    component: Cart
  },
  {
    path: 'checkout',
    component: Checkout
  },
  {
    path: 'payment',
    component: Payment
  },
  {
    path: 'payment/status',
    component: PaymentStatus
  },
  {
    // TODO: After backend implement, this logic will need to change to order/:orderId
    path: 'order',
    component: Order
  },
  {
    // TODO: After backend implement, need to have the CRUD function
    path: 'admin',
    component: Admin
  },
];
