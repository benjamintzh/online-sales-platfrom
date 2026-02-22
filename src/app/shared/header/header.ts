import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  brands: string[] = [];

  private isBrowser: boolean;

  constructor(
    public authService: AuthService,
    private productService: ProductService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // getBrands() is now an Observable — subscribe to it
    this.productService.getBrands().subscribe({
      next: brands => (this.brands = brands),
      error: () => (this.brands = []),
    });
  }

  get isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    try {
      return this.authService.isLoggedIn();
    } catch (e) {
      console.error('Error checking login status:', e);
      return false;
    }
  }

  get isAdmin(): boolean {
    return this.isBrowser && this.authService.isAdmin();
  }

  logout(): void {
    if (!this.isBrowser) return;
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }
}
