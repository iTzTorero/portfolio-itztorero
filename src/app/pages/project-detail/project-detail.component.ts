import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { ProjectsService } from '../../shared/projects.service';
import { Observable } from 'rxjs';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { SeoService } from '../../shared/seo.service';
import { LangService } from '../../shared/lang.service';
import { LocalizedText, LocalizedList, Project, ProjectOwnership } from '../../shared/portfolio.types';

const BASE_URL = 'https://itztorero.dev';

const OWNERSHIP_BADGE: Record<ProjectOwnership, string> = {
  'client': 'projectDetail.badges.client',
  'employer': 'projectDetail.badges.employer',
  'product-live': 'projectDetail.badges.productLive',
  'product-dev': 'projectDetail.badges.productDev',
  'research': 'projectDetail.badges.research',
};

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoPipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent implements OnDestroy {
  langSvc = inject(LangService);

  constructor(
    private route: ActivatedRoute,
    private projects: ProjectsService,
    private transloco: TranslocoService,
    private seo: SeoService
  ) {}

  lang(): 'en' | 'es' {
    return (this.transloco.getActiveLang() as 'en' | 'es') ?? 'en';
  }

  t(obj?: LocalizedText | null): string {
    const l = this.lang();
    return obj?.[l] ?? obj?.en ?? '';
  }

  tArr(obj?: LocalizedList | null): string[] {
    const l = this.lang();
    return obj?.[l] ?? obj?.en ?? [];
  }

  badgeKey(p: Project): string | null {
    return p.ownership ? OWNERSHIP_BADGE[p.ownership] ?? null : null;
  }

  project$: Observable<Project | undefined> = this.route.paramMap.pipe(
    switchMap((params) => this.projects.bySlug(params.get('slug') ?? '')),
    tap((p) => {
      if (!p) return;
      this.seo.update({
        title: this.t(p.name),
        description: this.t(p.metaDescription) || this.t(p.summary),
        path: `/projects/${p.slug}`,
      });
      this.setProjectJsonLd(p);
    })
  );

  ngOnDestroy() {
    this.seo.clearJsonLd('project');
    this.seo.clearJsonLd('breadcrumb');
  }

  private setProjectJsonLd(p: Project) {
    const links = [p.demo, p.github].filter(Boolean) as string[];
    this.seo.setJsonLd('project', {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: this.t(p.name),
      description: this.t(p.metaDescription) || this.t(p.summary),
      url: `${BASE_URL}/projects/${p.slug}`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      author: {
        '@type': 'Person',
        name: 'Juan Pablo Valenzuela Castro',
        url: BASE_URL,
      },
      ...(links.length ? { sameAs: links } : {}),
    });

    const prefix = this.lang() === 'es' ? '/es' : '';
    this.seo.setJsonLd('breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}${prefix || '/'}` },
        { '@type': 'ListItem', position: 2, name: 'Projects', item: `${BASE_URL}${prefix}/projects` },
        { '@type': 'ListItem', position: 3, name: this.t(p.name), item: `${BASE_URL}${prefix}/projects/${p.slug}` },
      ],
    });
  }
}
