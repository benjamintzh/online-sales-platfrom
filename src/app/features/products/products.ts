import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { ProductService, Product } from '../../services/product-service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class Products implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  brands: string[] = [];
  types: string[] = [];

  selectedBrands: Set<string> = new Set();
  selectedTypes: Set<string> = new Set();

  quantities: Map<number, number> = new Map();
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.products = this.productService.getProducts();
    this.brands = this.productService.getBrands();
    this.types = this.productService.getTypes();

    // React to both /products and /products/:brand
    this.route.paramMap.subscribe((params) => {
      const brand = params.get('brand');
      this.selectedBrands.clear();
      if (brand) {
        this.selectedBrands.add(this.capitalize(brand));
      }
      this.applyFilters();
    });
  }

  setQuantity(productId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);

    if (!isNaN(value) && value >= 1) {
      this.quantities.set(productId, value);
    } else {
      // Reset to 1 if invalid input
      this.quantities.set(productId, 1);
      input.value = '1';
    }
  }

  getQuantity(productId: number): number {
    return this.quantities.get(productId) ?? 1;
  }

  increment(productId: number): void {
    this.quantities.set(productId, this.getQuantity(productId) + 1);
  }

  decrement(productId: number): void {
    const current = this.getQuantity(productId);
    if (current > 1) {
      this.quantities.set(productId, current - 1);
    }
  }

  addToCart(product: Product): void {
    const quantity = this.getQuantity(product.id);
    console.log(`Added ${quantity}x ${product.name} to cart`);
    // this.cartService.addItem({ ...product, quantity });
  }

  toggleBrand(brand: string): void {
    this.selectedBrands.has(brand)
      ? this.selectedBrands.delete(brand)
      : this.selectedBrands.add(brand);
    this.applyFilters();
  }

  toggleType(type: string): void {
    this.selectedTypes.has(type)
      ? this.selectedTypes.delete(type)
      : this.selectedTypes.add(type);
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter((p) => {
      const brandMatch = this.selectedBrands.size === 0 || this.selectedBrands.has(p.brand);
      const typeMatch = this.selectedTypes.size === 0 || this.selectedTypes.has(p.type);
      return brandMatch && typeMatch;
    });
  }

  resetFilters(): void {
    this.selectedBrands.clear();
    this.selectedTypes.clear();
    this.filteredProducts = this.products;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
