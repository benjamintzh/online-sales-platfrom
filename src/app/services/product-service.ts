import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  brand: string;
  type: string;         // mapped from categoryName for UI compatibility
  categoryName: string;
  categoryId: number;
  price: number;
  image: string;        // mapped from imageUrl for UI compatibility
  imageUrl: string;
  stock: number;
  description?: string;
}

// Raw shape returned by the backend
interface ProductApiResponse {
  id: number;
  name: string;
  brand: string;
  categoryName: string;
  categoryId: number;
  price: number;
  imageUrl: string;
  stock: number;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // ── Public API ──────────────────────────────────────────────────────────────

  getProducts(brand?: string, categoryId?: number): Observable<Product[]> {
    let params = new HttpParams();
    if (brand) params = params.set('brand', brand);
    if (categoryId != null) params = params.set('categoryId', categoryId.toString());

    return new Observable(observer => {
      this.http.get<ProductApiResponse[]>(`${this.API_URL}/products`, { params }).subscribe({
        next: items => observer.next(items.map(this.mapProduct)),
        error: err => observer.error(err),
        complete: () => observer.complete(),
      });
    });
  }

  getProductById(id: number): Observable<Product> {
    return new Observable(observer => {
      this.http.get<ProductApiResponse>(`${this.API_URL}/products/${id}`).subscribe({
        next: item => observer.next(this.mapProduct(item)),
        error: err => observer.error(err),
        complete: () => observer.complete(),
      });
    });
  }

  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/products/brands`);
  }

  // ── Mapping ─────────────────────────────────────────────────────────────────

  private mapProduct(p: ProductApiResponse): Product {
    return {
      ...p,
      type: p.categoryName,       // UI uses 'type', backend sends 'categoryName'
      image: p.imageUrl,          // UI uses 'image', backend sends 'imageUrl'
    };
  }
}
