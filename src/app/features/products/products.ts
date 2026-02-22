import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { ProductService, Product } from '../../services/product-service';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class Products implements OnInit {
  private cartService = inject(CartService);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  brands: string[] = [];
  types: string[] = [];
  selectedBrands: Set<string> = new Set();
  selectedTypes: Set<string> = new Set();
  quantities: Map<number, number> = new Map();
  addedToCart: Set<number> = new Set();
  isLoading = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    // Load brands from backend
    this.productService.getBrands().subscribe({
      next: brands => (this.brands = brands),
    });

    // Load all products then filter by brand route param
    this.productService.getProducts().subscribe({
      next: products => {
        this.products = products;
        // Derive unique types from the loaded products
        this.types = [...new Set(products.map(p => p.type))];
        this.isLoading = false;

        // Apply brand from route param if present
        this.route.paramMap.subscribe(params => {
          const brand = params.get('brand');
          this.selectedBrands.clear();
          if (brand) {
            this.selectedBrands.add(this.capitalize(brand));
          }
          this.applyFilters();
        });
      },
      error: () => (this.isLoading = false),
    });
  }

  setQuantity(productId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    this.quantities.set(productId, !isNaN(value) && value >= 1 ? value : 1);
    if (isNaN(value) || value < 1) input.value = '1';
  }

  getQuantity(productId: number): number {
    return this.quantities.get(productId) ?? 1;
  }

  increment(productId: number): void {
    this.quantities.set(productId, this.getQuantity(productId) + 1);
  }

  decrement(productId: number): void {
    const current = this.getQuantity(productId);
    if (current > 1) this.quantities.set(productId, current - 1);
  }

  addToCart(product: Product): void {
    const quantity = this.getQuantity(product.id);
    this.cartService.addItem(product, quantity);
    alert(`${product.name} x${quantity} has been added to Cart`);
    this.addedToCart.add(product.id);
    this.quantities.delete(product.id);
    setTimeout(() => this.addedToCart.delete(product.id), 1500);
  }

  isAdded(productId: number): boolean {
    return this.addedToCart.has(productId);
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
    this.filteredProducts = this.products.filter(p => {
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

  viewProduct(product: Product): void {
    this.router.navigate(['/products', product.brand.toLowerCase(), product.id]);
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
