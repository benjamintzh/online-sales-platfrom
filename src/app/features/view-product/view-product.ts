import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product-service';
import { Header } from "../../shared/header/header";
import { Footer } from "../../shared/footer/footer";

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './view-product.html',
  styleUrls: ['./view-product.css'],
})
export class ViewProduct implements OnInit {
  product: Product | null = null;

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.product = this.productService.getProducts().find(p => p.id === id) || null;
    });
  }
}
