import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrls: ['./carousel.css']
})
export class Carousel implements OnInit, OnDestroy {
  images = [
    'assets/banner1.png',
    'assets/banner2.png',
    'assets/banner3.png'
  ];

  currentIndex = 0;
  intervalId?: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.next();
      this.cdr.detectChanges();
    }, 3000);
  }

  stopAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  manualNext(): void {
    this.stopAutoSlide();
    this.next();
    this.startAutoSlide();
  }

  manualPrev(): void {
    this.stopAutoSlide();
    this.prev();
    this.startAutoSlide();
  }

  goToSlide(index: number): void {
    this.stopAutoSlide();
    this.currentIndex = index;
    this.startAutoSlide();
  }
}