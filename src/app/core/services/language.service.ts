import { Injectable } from '@angular/core';
import enTranslations from '../../../assets/i18n/en.json';
import arTranslations from '../../../assets/i18n/ar.json';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLang: Language = 'ar';
  t = arTranslations;

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('eib_lang') as Language | null;
      if (saved === 'ar' || saved === 'en') {
        this.setLanguage(saved);
      } else {
        this.updateDocument();
      }
    } else {
      this.updateDocument();
    }
  }

  setLanguage(lang: Language) {
    this.currentLang = lang;
    this.t = lang === 'ar' ? arTranslations : enTranslations;

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('eib_lang', lang);
    }
    this.updateDocument();
  }

  toggleLanguage() {
    this.setLanguage(this.currentLang === 'en' ? 'ar' : 'en');
  }

  isRtl() {
    return this.currentLang === 'ar';
  }

  updateDocument() {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = this.currentLang;
      document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    }
  }
}
