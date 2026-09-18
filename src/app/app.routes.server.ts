import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'services/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [
        { slug: 'management-consulting' },
        { slug: 'financial-solutions' },
        { slug: 'quality-iso-excellence' },
        { slug: 'pr-media' },
        { slug: 'exhibitions-events' },
        { slug: 'business-technology-software' },
        { slug: 'professional-development' },
        { slug: 'digital-marketing-advertising' },
        { slug: 'contracting-construction' },
        { slug: 'nonprofit-charities' }
      ];
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
