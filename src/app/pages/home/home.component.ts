import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { CtaComponent } from '../../shared/components/cta/cta.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CtaComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  serviceSlideIndex = 0;
  isServicesDragging = false;
  servicesDragDeltaX = 0;
  wasServicesDragged = false;
  private servicesDragStartX = 0;
  private servicesDragStartY = 0;
  private isServicesPointerDown = false;

  industrySlideIndex = 0;
  isDragging = false;
  dragDeltaX = 0;
  wasDragged = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private isPointerDown = false;

  languageService: LanguageService;

  get totalServicesFormatted(): string {
    const count = this.languageService.t.services.length;
    return count < 10 ? `0${count}` : `${count}`;
  }

  constructor(languageService: LanguageService) {
    this.languageService = languageService;
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.serviceSlideIndex > this.maxServiceIndex) {
      this.serviceSlideIndex = this.maxServiceIndex;
    }
    if (this.industrySlideIndex > this.maxIndustryIndex) {
      this.industrySlideIndex = this.maxIndustryIndex;
    }
  }

  get maxServiceIndex(): number {
    const total = this.languageService.t.services.length;
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return Math.max(0, total - 3);
      if (window.innerWidth >= 640) return Math.max(0, total - 2);
    }
    return Math.max(0, total - 1);
  }

  get maxIndustryIndex(): number {
    const total = this.industries.length;
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return Math.max(0, total - 3);
      if (window.innerWidth >= 640) return Math.max(0, total - 2);
    }
    return Math.max(0, total - 1);
  }

  get currentSlideFormatted(): string {
    const num = this.industrySlideIndex + 1;
    return num < 10 ? `0${num}` : `${num}`;
  }

  get totalSlidesFormatted(): string {
    const total = this.industries.length;
    return total < 10 ? `0${total}` : `${total}`;
  }

  get progressPercent(): number {
    const max = this.maxIndustryIndex;
    if (max <= 0) return 100;
    return Math.min(100, Math.round((this.industrySlideIndex / max) * 100));
  }

  nextIndustrySlide() {
    if (this.industrySlideIndex >= this.maxIndustryIndex) {
      this.industrySlideIndex = 0;
    } else {
      this.industrySlideIndex++;
    }
  }

  prevIndustrySlide() {
    if (this.industrySlideIndex <= 0) {
      this.industrySlideIndex = this.maxIndustryIndex;
    } else {
      this.industrySlideIndex--;
    }
  }

  onPointerDown(event: PointerEvent) {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    this.isPointerDown = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.dragDeltaX = 0;
    this.wasDragged = false;
  }

  onPointerMove(event: PointerEvent) {
    if (!this.isPointerDown) return;
    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;

    if (!this.isDragging) {
      if (Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY)) {
        this.isDragging = true;
        try {
          (event.currentTarget as HTMLElement)?.setPointerCapture(event.pointerId);
        } catch (_) { }
      } else {
        return;
      }
    }

    const isAtStart = this.industrySlideIndex === 0;
    const isAtEnd = this.industrySlideIndex >= this.maxIndustryIndex;
    const isRtl = this.languageService.isRtl();

    const pullingPastStart = isRtl ? (isAtStart && deltaX < 0) : (isAtStart && deltaX > 0);
    const pullingPastEnd = isRtl ? (isAtEnd && deltaX > 0) : (isAtEnd && deltaX < 0);

    if (pullingPastStart || pullingPastEnd) {
      this.dragDeltaX = deltaX * 0.3;
    } else {
      this.dragDeltaX = deltaX;
    }
  }

  onPointerUp(event: PointerEvent) {
    if (!this.isPointerDown) return;
    this.isPointerDown = false;

    if (this.isDragging) {
      try {
        (event.currentTarget as HTMLElement)?.releasePointerCapture(event.pointerId);
      } catch (_) { }
      this.isDragging = false;

      const threshold = 45;
      const isRtl = this.languageService.isRtl();

      if (isRtl) {
        if (this.dragDeltaX > threshold) {
          if (this.industrySlideIndex < this.maxIndustryIndex) {
            this.industrySlideIndex++;
          }
        } else if (this.dragDeltaX < -threshold) {
          if (this.industrySlideIndex > 0) {
            this.industrySlideIndex--;
          }
        }
      } else {
        if (this.dragDeltaX < -threshold) {
          if (this.industrySlideIndex < this.maxIndustryIndex) {
            this.industrySlideIndex++;
          }
        } else if (this.dragDeltaX > threshold) {
          if (this.industrySlideIndex > 0) {
            this.industrySlideIndex--;
          }
        }
      }

      if (Math.abs(this.dragDeltaX) > 6) {
        this.wasDragged = true;
        setTimeout(() => {
          this.wasDragged = false;
        }, 120);
      }
      this.dragDeltaX = 0;
    }
  }

  onPointerCancel(event: PointerEvent) {
    if (this.isPointerDown) {
      this.isPointerDown = false;
      this.isDragging = false;
      this.dragDeltaX = 0;
      try {
        (event.currentTarget as HTMLElement)?.releasePointerCapture(event.pointerId);
      } catch (_) { }
    }
  }

  onCardClick(event: MouseEvent) {
    if (this.wasDragged) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  getIndustryTrackTransform(): string {
    const baseCalc = `${this.industrySlideIndex} * (100% + var(--slider-gap, 32px)) / var(--cards-per-view, 3)`;
    if (this.languageService.isRtl()) {
      if (this.isDragging && this.dragDeltaX !== 0) {
        return `translateX(calc(${baseCalc} + ${this.dragDeltaX}px))`;
      }
      return `translateX(calc(${baseCalc}))`;
    } else {
      if (this.isDragging && this.dragDeltaX !== 0) {
        return `translateX(calc(-1 * (${baseCalc}) + ${this.dragDeltaX}px))`;
      }
      return `translateX(calc(-1 * (${baseCalc})))`;
    }
  }

  getServicesTrackTransform(): string {
    const baseCalc = `${this.serviceSlideIndex} * (100% + var(--slider-gap, 24px)) / var(--cards-per-view, 3)`;
    if (this.languageService.isRtl()) {
      if (this.isServicesDragging && this.servicesDragDeltaX !== 0) {
        return `translateX(calc(${baseCalc} + ${this.servicesDragDeltaX}px))`;
      }
      return `translateX(calc(${baseCalc}))`;
    } else {
      if (this.isServicesDragging && this.servicesDragDeltaX !== 0) {
        return `translateX(calc(-1 * (${baseCalc}) + ${this.servicesDragDeltaX}px))`;
      }
      return `translateX(calc(-1 * (${baseCalc})))`;
    }
  }

  prevSlide() {
    if (this.serviceSlideIndex <= 0) {
      this.serviceSlideIndex = this.maxServiceIndex;
    } else {
      this.serviceSlideIndex--;
    }
  }

  nextSlide() {
    if (this.serviceSlideIndex >= this.maxServiceIndex) {
      this.serviceSlideIndex = 0;
    } else {
      this.serviceSlideIndex++;
    }
  }

  onServicesPointerDown(event: PointerEvent) {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    this.isServicesPointerDown = true;
    this.servicesDragStartX = event.clientX;
    this.servicesDragStartY = event.clientY;
    this.servicesDragDeltaX = 0;
    this.wasServicesDragged = false;
  }

  onServicesPointerMove(event: PointerEvent) {
    if (!this.isServicesPointerDown) return;
    const deltaX = event.clientX - this.servicesDragStartX;
    const deltaY = event.clientY - this.servicesDragStartY;

    if (!this.isServicesDragging) {
      if (Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY)) {
        this.isServicesDragging = true;
        try {
          (event.currentTarget as HTMLElement)?.setPointerCapture(event.pointerId);
        } catch (_) { }
      } else {
        return;
      }
    }

    const isAtStart = this.serviceSlideIndex === 0;
    const isAtEnd = this.serviceSlideIndex >= this.maxServiceIndex;
    const isRtl = this.languageService.isRtl();

    const pullingPastStart = isRtl ? (isAtStart && deltaX < 0) : (isAtStart && deltaX > 0);
    const pullingPastEnd = isRtl ? (isAtEnd && deltaX > 0) : (isAtEnd && deltaX < 0);

    if (pullingPastStart || pullingPastEnd) {
      this.servicesDragDeltaX = deltaX * 0.3;
    } else {
      this.servicesDragDeltaX = deltaX;
    }
  }

  onServicesPointerUp(event: PointerEvent) {
    if (!this.isServicesPointerDown) return;
    this.isServicesPointerDown = false;

    if (this.isServicesDragging) {
      try {
        (event.currentTarget as HTMLElement)?.releasePointerCapture(event.pointerId);
      } catch (_) { }
      this.isServicesDragging = false;

      const threshold = 45;
      const isRtl = this.languageService.isRtl();

      if (isRtl) {
        if (this.servicesDragDeltaX > threshold) {
          if (this.serviceSlideIndex < this.maxServiceIndex) {
            this.serviceSlideIndex++;
          }
        } else if (this.servicesDragDeltaX < -threshold) {
          if (this.serviceSlideIndex > 0) {
            this.serviceSlideIndex--;
          }
        }
      } else {
        if (this.servicesDragDeltaX < -threshold) {
          if (this.serviceSlideIndex < this.maxServiceIndex) {
            this.serviceSlideIndex++;
          }
        } else if (this.servicesDragDeltaX > threshold) {
          if (this.serviceSlideIndex > 0) {
            this.serviceSlideIndex--;
          }
        }
      }

      if (Math.abs(this.servicesDragDeltaX) > 6) {
        this.wasServicesDragged = true;
        setTimeout(() => {
          this.wasServicesDragged = false;
        }, 120);
      }
      this.servicesDragDeltaX = 0;
    }
  }

  onServicesPointerCancel(event: PointerEvent) {
    if (this.isServicesPointerDown) {
      this.isServicesPointerDown = false;
      this.isServicesDragging = false;
      this.servicesDragDeltaX = 0;
      try {
        (event.currentTarget as HTMLElement)?.releasePointerCapture(event.pointerId);
      } catch (_) { }
    }
  }

  onServiceCardClick(event: MouseEvent) {
    if (this.wasServicesDragged) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  get industries() {
    return this.languageService.t.industries || [];
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop';
    }
  }
}



