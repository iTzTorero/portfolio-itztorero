import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ProjectsService } from '../../shared/projects.service';
import { Observable } from 'rxjs';
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
  imports: [CommonModule, RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent {
  project$: Observable<Project | undefined> = this.route.paramMap.pipe(
    switchMap((params) => this.projects.bySlug(params.get('slug') ?? ''))
  );

  constructor(private route: ActivatedRoute, private projects: ProjectsService) { }
}
