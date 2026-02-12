import { Component } from '@angular/core';
import { Header } from "../../shared/header/header";
import { Footer } from "../../shared/footer/footer";

@Component({
  selector: 'app-products',
  imports: [Header, Footer],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {

}
