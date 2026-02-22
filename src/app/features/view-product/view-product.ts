import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product-service';
import { CartService } from '../../services/cart-service';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Header, Footer],
  templateUrl: './view-product.html',
  styleUrls: ['./view-product.css'],
})
export class ViewProduct implements OnInit {
  private cartService = inject(CartService);

  product: Product | null = null;
  quantity = 1;
  added = false;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.quantity = 1;
      this.added = false;
      this.isLoading = true;

      this.productService.getProductById(id).subscribe({
        next: product => {
          this.product = product;
          this.isLoading = false;
        },
        error: () => {
          this.product = null;
          this.isLoading = false;
        },
      });
    });
  }

  increment(): void {
    if (!this.product) return;
    if (this.quantity < this.product.stock) this.quantity++;
  }

  decrement(): void {
    if (this.quantity > 1) this.quantity--;
  }

  setQuantity(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    const max = this.product?.stock ?? 1;
    if (!isNaN(value) && value >= 1 && value <= max) {
      this.quantity = value;
    } else {
      this.quantity = Math.min(Math.max(1, value || 1), max);
      input.value = String(this.quantity);
    }
  }

  get stockStatus(): string {
    if (!this.product) return '';
    if (this.product.stock === 0) return 'out';
    if (this.product.stock <= 10) return 'low';
    return 'in';
  }

  addToCart(): void {
    if (!this.product) return;
    this.cartService.addItem(this.product, this.quantity);
    alert(`${this.product.name} x${this.quantity} has been added to Cart`);
    this.added = true;
    setTimeout(() => (this.added = false), 1500);
  }
}
