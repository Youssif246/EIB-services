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

  activeAccordionIndex: number = -1;

  toggleAccordion(index: number) {
    if (this.activeAccordionIndex === index) {
      this.activeAccordionIndex = -1;
      return;
    }

    const prevIndex = this.activeAccordionIndex;

    if (typeof document === 'undefined' || typeof window === 'undefined') {
      this.activeAccordionIndex = index;
      return;
    }

    const items = document.querySelectorAll('.editorial-accordion-item');
    const targetItem = items[index - 1] as HTMLElement;

    // Top-to-bottom transition: an open accordion exists ABOVE the clicked item.
    // Calculate the exact post-collapse top offset so the clicked item sits perfectly under the floating navbar.
    if (prevIndex !== -1 && prevIndex < index && targetItem) {
      const prevItem = items[prevIndex - 1] as HTMLElement;
      const prevContent = prevItem ? (prevItem.querySelector('.accordion-content-collapse') as HTMLElement) : null;
      const prevHeight = prevContent ? (prevContent.getBoundingClientRect().height || prevContent.offsetHeight) : 0;

      const navEl = document.querySelector('.eib-floating-nav-wrapper') || document.querySelector('header');
      const navOffset = navEl ? Math.round(navEl.getBoundingClientRect().height + 24) : 95;

      const targetCurrentTop = targetItem.getBoundingClientRect().top + window.scrollY;
      const finalTargetTop = targetCurrentTop - prevHeight;
      const finalScrollY = Math.max(0, finalTargetTop - navOffset);

      this.activeAccordionIndex = index;

      window.scrollTo({
        top: finalScrollY,
        behavior: 'smooth'
      });
      return;
    }

    // Bottom-to-top transition or first item open:
    // If the target item's header is partially obscured under the sticky header, bring it smoothly into view.
    if (targetItem) {
      const navEl = document.querySelector('.eib-floating-nav-wrapper') || document.querySelector('header');
      const navOffset = navEl ? Math.round(navEl.getBoundingClientRect().height + 24) : 95;
      const rect = targetItem.getBoundingClientRect();

      this.activeAccordionIndex = index;

      if (rect.top < navOffset) {
        const targetCurrentTop = rect.top + window.scrollY;
        window.scrollTo({
          top: Math.max(0, targetCurrentTop - navOffset),
          behavior: 'smooth'
        });
      }
      return;
    }

    this.activeAccordionIndex = index;
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



