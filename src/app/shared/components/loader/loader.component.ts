import { Component, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  private platformId = inject(PLATFORM_ID);
  public themeService = inject(ThemeService);
  isFinished = false;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Safety timeout to guarantee DOM cleanup after curtain lift finishes
      setTimeout(() => {
        this.isFinished = true;
      }, 2200);
    }
  }

  onAnimationEnd(event: AnimationEvent) {
    if (event.animationName === 'eibCurtainLift' || event.animationName === 'eibQuickDismiss') {
      this.isFinished = true;
    }
  }
}
