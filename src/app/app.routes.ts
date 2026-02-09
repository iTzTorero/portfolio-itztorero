import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomePage), title: 'Juan Pablo | Software Engineer' },
    { path: 'projects', loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsPage), title: 'Projects | Juan Pablo' },
    { path: 'experience', loadComponent: () => import('./pages/experience/experience.component').then(m => m.ExperiencePage), title: 'Experience | Juan Pablo' },
    { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactPage), title: 'Contact | Juan Pablo' },
    {
        path: 'projects/:slug',
        loadComponent: () =>
            import('./pages/project-detail/project-detail.component').then((m) => m.ProjectDetailComponent),
        title: 'Project | Juan Pablo',
    },

    { path: '**', redirectTo: '' },

];
