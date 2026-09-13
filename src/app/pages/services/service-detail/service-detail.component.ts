import { Component, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { CtaComponent } from '../../../shared/components/cta/cta.component';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [RouterModule, CtaComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.css'
})
export class ServiceDetailComponent implements OnInit {
  @ViewChild('swiperEl') swiperEl?: ElementRef;

  slug = '';
  languageService: LanguageService;
  activeSlideIndex = 0;

  constructor(
    private route: ActivatedRoute,
    languageService: LanguageService
  ) {
    this.languageService = languageService;
    this.slug = route.snapshot.paramMap.get('slug') || '';
  }

  ngOnInit() {}

  scrollToOverview(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    if (typeof document !== 'undefined') {
      const el = document.getElementById('overview');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  ngAfterViewInit() {
    if (this.swiperEl?.nativeElement) {
      const swiperContainer = this.swiperEl.nativeElement;
      swiperContainer.addEventListener('swiperslidechange', () => {
        const swiper = swiperContainer.swiper;
        if (swiper) {
          this.activeSlideIndex = swiper.realIndex ?? swiper.activeIndex ?? 0;
        }
      });
    }
  }

  get service() {
    const s = this.route.snapshot.paramMap.get('slug') || this.slug;
    return this.languageService.t.services.find((item: any) => item.slug === s) || null;
  }

  get nextService() {
    const services = this.languageService.t.services;
    const s = this.route.snapshot.paramMap.get('slug') || this.slug;
    const idx = services.findIndex((item: any) => item.slug === s);
    if (idx !== -1) {
      return idx + 1 < services.length ? services[idx + 1] : services[0];
    }
    return null;
  }

  prevSlide() {
    const swiper = (this.swiperEl?.nativeElement as any)?.swiper;
    if (swiper) {
      swiper.slidePrev();
    }
  }

  nextSlide() {
    const swiper = (this.swiperEl?.nativeElement as any)?.swiper;
    if (swiper) {
      swiper.slideNext();
    }
  }
}



