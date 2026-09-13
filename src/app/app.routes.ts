import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'شركة إيليت لقطاع الأعمال | حلول تشغيلية واستشارات إدارية متكاملة'
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./pages/services/services.component').then(m => m.ServicesComponent),
    title: 'خدمات استشارات الأعمال والحلول المؤسسية | شركة إيليت'
  },
  {
    path: 'services/:slug',
    loadComponent: () =>
      import('./pages/services/service-detail/service-detail.component').then(
        m => m.ServiceDetailComponent
      ),
    title: 'خدمات وحلول شركة إيليت المتكاملة | Elite Enterprise Solutions'
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'عن إيليت | التميز التشغيلي والشريك الاستراتيجي لنمو الشركات'
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'تواصل مع شركة إيليت | احجز جلستك الاستشارية لتطوير أعمالك'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
