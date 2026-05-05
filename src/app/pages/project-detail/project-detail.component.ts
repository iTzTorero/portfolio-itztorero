import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { ProjectsService } from '../../shared/projects.service';
import { Observable } from 'rxjs';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { SeoService } from '../../shared/seo.service';
export type Project = {
  slug: string;
  name: string;
  summary: string;

  ownership?: 'personal' | 'professional';
  role?: string;
  confidentiality?: string;
  disclaimer?: string;

  stack: string[];

  // optional arrays
  tags?: string[];
  impact?: string[];
  highlights?: string[];
  architecture?: string[];

  // nested products
  products?: { name: string; type: string; description: string }[];

  // links
  github?: string;
  demo?: string;
};

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoPipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent {
  constructor(
    private route: ActivatedRoute,
    private projects: ProjectsService,
    private transloco: TranslocoService,
    private seo: SeoService
  ) {}

  lang(): 'en' | 'es' {
    return (this.transloco.getActiveLang() as 'en' | 'es') ?? 'en';
  }

  t(obj: any): string {
    const l = this.lang();
    return obj?.[l] ?? obj?.en ?? '';
  }

  tArr(obj: any): string[] {
    const l = this.lang();
    return obj?.[l] ?? obj?.en ?? [];
  }

  project$: Observable<Project | undefined> = this.route.paramMap.pipe(
    switchMap((params) => this.projects.bySlug(params.get('slug') ?? '')),
    tap((p) => {
      if (p) this.seo.update({
        title: this.t(p.name),
        description: this.t(p.summary),
        path: `/projects/${p.slug}`,
      });
    })
  );


}
