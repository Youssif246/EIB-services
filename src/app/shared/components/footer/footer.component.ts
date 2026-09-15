import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrandLogoComponent } from '../brand-logo/brand-logo.component';
import { LanguageService } from '../../../core/services/language.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, BrandLogoComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  languageService: LanguageService;
  themeService: ThemeService;

  constructor(languageService: LanguageService, themeService: ThemeService) {
    this.languageService = languageService;
    this.themeService = themeService;
  }
}

