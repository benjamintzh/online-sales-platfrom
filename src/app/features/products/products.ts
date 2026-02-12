import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { ProductService, Product } from '../../services/product-service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, Header, Footer],
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

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.products = this.productService.getProducts();
    this.brands = this.productService.getBrands();
    this.types = this.productService.getTypes();

    // React to both /products and /products/:brand
    this.route.paramMap.subscribe((params) => {
      const brand = params.get('brand');
      this.selectedBrands.clear(); // reset before applying
      if (brand) {
        this.selectedBrands.add(this.capitalize(brand));
      }
      this.applyFilters();
    });
  }

  toggleBrand(brand: string): void {
    this.selectedBrands.has(brand)
      ? this.selectedBrands.delete(brand)
      : this.selectedBrands.add(brand);
    this.applyFilters();
  }

  toggleType(type: string): void {
    this.selectedTypes.has(type) ? this.selectedTypes.delete(type) : this.selectedTypes.add(type);
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
