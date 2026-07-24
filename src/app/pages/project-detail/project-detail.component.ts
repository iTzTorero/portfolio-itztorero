import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { ProjectsService } from '../../shared/projects.service';
import { Observable } from 'rxjs';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { SeoService } from '../../shared/seo.service';
import { LocalizedText, LocalizedList, Project } from '../../shared/portfolio.types';

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

  t(obj?: LocalizedText | null): string {
    const l = this.lang();
    return obj?.[l] ?? obj?.en ?? '';
  }

  tArr(obj?: LocalizedList | null): string[] {
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
