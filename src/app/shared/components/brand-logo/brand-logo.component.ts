import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  templateUrl: './brand-logo.component.html',
  styleUrl: './brand-logo.component.css'
})
export class BrandLogoComponent {
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}
