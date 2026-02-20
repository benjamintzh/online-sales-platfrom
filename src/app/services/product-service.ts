import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  brand: string;
  type: string;
  price: number;
  image: string;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'Logitech Keyboard', brand: 'Logitech', type: 'Keyboard', price: 99.99, image: 'assets/logitech-keyboard.webp', stock: 45 },
    { id: 2, name: 'Dell Monitor', brand: 'Dell', type: 'Monitor', price: 199.99, image: 'assets/dell-monitor.webp', stock: 12 },
    { id: 3, name: 'Asus Laptop', brand: 'Asus', type: 'Laptop', price: 899.99, image: 'assets/asus-laptop.webp', stock: 8 },
    { id: 4, name: 'Asus Keyboard', brand: 'Asus', type: 'Keyboard', price: 59.99, image: 'assets/asus-keyboard.webp', stock: 30 },
  ];

  getProducts(): Product[] {
    return this.products;
  }

  getBrands(): string[] {
    return [...new Set(this.products.map(p => p.brand))];
  }

  getTypes(): string[] {
    return [...new Set(this.products.map(p => p.type))];
  }
}
