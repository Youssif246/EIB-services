import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { CtaComponent } from '../../shared/components/cta/cta.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterModule, CtaComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  languageService: LanguageService;

  constructor(languageService: LanguageService) {
    this.languageService = languageService;
  }

  get services() {
    return this.languageService.t.services || [];
  }
}
