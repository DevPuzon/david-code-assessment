import { Component, OnInit } from '@angular/core';
import { MemeService } from '../../services/meme.service';
import { Meme } from '../../models/meme.model';

@Component({
  selector: 'image-carousel', 
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.scss'
})
export class ImageCarouselComponent implements OnInit {
  currentSlide = 0;
  slides:Meme[] = [];  

  constructor(
    private memeService:MemeService
  ){

  }

  ngOnInit(): void { 
    this.fetchMemes();
  }

  fetchMemes() {
    this.memeService.getMemes().subscribe(response => {
      if (response.success && response.data && response.data.memes) {
        this.slides = response.data.memes;
      } else {
        console.error('Failed to fetch meme data');
      }
    });
  }
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }
}