import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  currentTheme: Theme = 'light';

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('eib_theme') as Theme | null;
      if (saved === 'dark' || saved === 'light') {
        this.currentTheme = saved;
      }
      this.applyTheme();
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('eib_theme', this.currentTheme);
    }
    this.applyTheme();
  }

  applyTheme() {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      document.documentElement.classList.toggle('dark', this.currentTheme === 'dark');
    }
  }

  isDark() {
    return this.currentTheme === 'dark';
  }
}
