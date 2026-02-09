import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

export type Project = {
    slug: string;
    name: string;
    summary: string;
    ownership?: 'personal' | 'professional';
    role?: string;
    disclaimer?: string;
    stack: string[];
    tags: string[];
    highlights?: string[];
    architecture?: string[];
    github?: string;
    demo?: string;
};

@Injectable({ providedIn: 'root' })
export class ProjectsService {
    private projects$ = this.http
        .get<Project[]>('assets/projects.json')
        .pipe(shareReplay(1));

    constructor(private http: HttpClient) { }

    list(): Observable<Project[]> {
        return this.projects$;
    }

    bySlug(slug: string): Observable<Project | undefined> {
        return this.projects$.pipe(map((arr) => arr.find((p) => p.slug === slug)));
    }
}
