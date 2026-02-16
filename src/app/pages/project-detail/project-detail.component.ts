import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ProjectsService } from '../../shared/projects.service';
import { Observable } from 'rxjs';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
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
  constructor(private route: ActivatedRoute, private projects: ProjectsService, private transloco: TranslocoService) { }


  lang(): 'en' | 'es' {
    return (this.transloco.getActiveLang() as 'en' | 'es') ?? 'en';
  }

  t(obj: any): string {
    // Para campos tipo {en, es}
    const l = this.lang();
    return obj?.[l] ?? obj?.en ?? '';
  }

  tArr(obj: any): string[] {
    const l = this.lang();
    return obj?.[l] ?? obj?.en ?? [];
  }
  project$: Observable<Project | undefined> = this.route.paramMap.pipe(
    switchMap((params) => this.projects.bySlug(params.get('slug') ?? ''))
  );


}
