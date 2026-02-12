import { Component } from '@angular/core';
import { Carousel } from '../../shared/carousel/carousel';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Carousel, CommonModule, Header, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
