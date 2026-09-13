import { Component, HostListener, HostBinding, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { BrandLogoComponent } from '../brand-logo/brand-logo.component';
import { LanguageService } from '../../../core/services/language.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, BrandLogoComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnDestroy {
  mobileMenuOpen = false;
  isScrolled = false;
  languageService: LanguageService;
  themeService: ThemeService;
  router: Router;
  private isBrowser: boolean;
  private routeSub?: Subscription;

  @HostBinding('class.menu-open')
  get isMenuOpen() {
    return this.mobileMenuOpen;
  }

  constructor(
    languageService: LanguageService,
    themeService: ThemeService,
    router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.languageService = languageService;
    this.themeService = themeService;
    this.router = router;
    this.isBrowser = isPlatformBrowser(platformId);

    // Automatically close mobile menu on any navigation
    this.routeSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.mobileMenuOpen) {
          this.closeMobileMenu();
        }
      });
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (this.isBrowser) {
      this.isScrolled = window.scrollY > 20;
    }
  }

  toggleMobileMenu(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.syncBodyScroll();
  }

  closeMobileMenu(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.mobileMenuOpen = false;
    this.syncBodyScroll();
  }

  private syncBodyScroll() {
    if (this.isBrowser) {
      if (this.mobileMenuOpen) {
        document.documentElement.classList.add('mobile-nav-open');
      } else {
        document.documentElement.classList.remove('mobile-nav-open');
      }
    }
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    if (this.isBrowser) {
      document.documentElement.classList.remove('mobile-nav-open');
    }
  }

  isServicesActive() {
    return this.router.url.startsWith('/services');
  }
}
