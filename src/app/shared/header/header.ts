import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  productCategories = [
    { name: 'Mouse', link: '/products/mouse' },
    { name: 'Keyboard', link: '/products/keyboard' },
    { name: 'Monitor', link: '/products/monitor' },
    { name: 'Laptop', link: '/products/laptop' },
    { name: 'PC Component', link: '/products/components' },
  ];

  private isBrowser: boolean;

  constructor(
    public authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
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

  logout(): void {
    if (!this.isBrowser) return;
    
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }
}