import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Carousel } from '../../shared/carousel/carousel';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Carousel, CommonModule, Header, Footer],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  brands: string[] = [];
  visibleBrands: string[] = [];
  startIndex = 0;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.brands = this.productService.getBrands();
    this.updateVisibleBrands();
  }

  updateVisibleBrands(): void {
    this.visibleBrands = this.brands.slice(this.startIndex, this.startIndex + 4);
  }

  nextBrand(): void {
    if (this.startIndex + 4 < this.brands.length) {
      this.startIndex++;
      this.updateVisibleBrands();
    }
  }

  prevBrand(): void {
    if (this.startIndex > 0) {
      this.startIndex--;
      this.updateVisibleBrands();
    }
  }

  goToBrand(brand: string): void {
    this.router.navigate(['/products', brand.toLowerCase()]);
  }
}
