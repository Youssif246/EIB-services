import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.css'
})
export class CtaComponent {
  @Input() customUrl?: string;

  languageService: LanguageService;

  constructor(languageService: LanguageService) {
    this.languageService = languageService;
  }
}
