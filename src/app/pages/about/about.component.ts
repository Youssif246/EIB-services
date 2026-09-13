import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  languageService: LanguageService;

  constructor(languageService: LanguageService) {
    this.languageService = languageService;
  }
}
