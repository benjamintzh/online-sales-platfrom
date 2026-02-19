import { Routes } from '@angular/router';
import { Cart } from './features/cart/cart';

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
];
