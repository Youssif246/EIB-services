import { Component, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  private platformId = inject(PLATFORM_ID);
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
