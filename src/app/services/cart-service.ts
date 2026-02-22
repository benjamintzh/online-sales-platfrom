import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { AuthService } from '../core/auth/auth.service';

export interface CartItem {
  id: number;           // cart item ID from backend
  productId: number;
  name: string;         // productName
  brand: string;        // productBrand
  type: string;
  price: number;
  image: string;        // imageUrl
  quantity: number;
  stock: number;        // fetched from GET /api/products/{id}
  subtotal: number;
}

// Raw shape from backend CartDto.CartItemResponse
interface CartItemApi {
  id: number;
  productId: number;
  productName: string;
  productBrand: string;
  imageUrl: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface CartApi {
  items: CartItemApi[];
  total: number;
  itemCount: number;
}

interface ProductApi {
  id: number;
  stock: number;
  categoryName: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly CART_URL = 'http://localhost:8080/api/cart';
  private readonly PRODUCTS_URL = 'http://localhost:8080/api/products';

  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Load cart from backend whenever user logs in
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadCart();
      } else {
        this.itemsSubject.next([]);
      }
    });
  }

  // ── Public getters ──────────────────────────────────────────────────────────

  get items(): CartItem[] {
    return this.itemsSubject.getValue();
  }

  get subtotal(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  // ── API actions ─────────────────────────────────────────────────────────────

  loadCart(): void {
    this.http.get<CartApi>(this.CART_URL).pipe(
      switchMap(cart => this.enrichWithStock(cart.items))
    ).subscribe({
      next: items => this.itemsSubject.next(items),
      error: () => this.itemsSubject.next([]),
    });
  }

  addItem(product: { id: number; name: string; brand: string; type: string; price: number; image: string; stock: number }, quantity: number): void {
    this.http.post<CartApi>(this.CART_URL, { productId: product.id, quantity }).pipe(
      switchMap(cart => this.enrichWithStock(cart.items))
    ).subscribe({
      next: items => this.itemsSubject.next(items),
    });
  }

  updateQuantity(cartItemId: number, quantity: number): void {
    this.http.put<CartApi>(`${this.CART_URL}/${cartItemId}`, { quantity }).pipe(
      switchMap(cart => this.enrichWithStock(cart.items))
    ).subscribe({
      next: items => this.itemsSubject.next(items),
    });
  }

  removeItem(cartItemId: number): void {
    this.http.delete<CartApi>(`${this.CART_URL}/${cartItemId}`).pipe(
      switchMap(cart => this.enrichWithStock(cart.items))
    ).subscribe({
      next: items => this.itemsSubject.next(items),
    });
  }

  clearCart(): void {
    this.http.delete(this.CART_URL).subscribe({
      next: () => this.itemsSubject.next([]),
    });
  }

  // ── Stock enrichment ────────────────────────────────────────────────────────

  /**
   * For each cart item, fetch the corresponding product to get its real stock
   * and categoryName. Uses forkJoin so all requests fire in parallel.
   */
  private enrichWithStock(cartItems: CartItemApi[]) {
    if (cartItems.length === 0) {
      return of([]);
    }

    const productRequests = cartItems.map(item =>
      this.http.get<ProductApi>(`${this.PRODUCTS_URL}/${item.productId}`).pipe(
        catchError(() => of({ id: item.productId, stock: 0, categoryName: '' }))
      )
    );

    return forkJoin(productRequests).pipe(
      map(products =>
        cartItems.map((item, index) => ({
          id: item.id,
          productId: item.productId,
          name: item.productName,
          brand: item.productBrand,
          type: products[index].categoryName,
          price: item.price,
          image: item.imageUrl,
          quantity: item.quantity,
          stock: products[index].stock,   // real stock from product API
          subtotal: item.subtotal,
        }))
      )
    );
  }
}
