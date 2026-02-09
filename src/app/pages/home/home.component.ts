import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomePage {
  name = 'Juan Pablo Valenzuela Castro';
  headline = 'Backend-focused Software Engineer | GCP | FastAPI | Microservices | ML for Precision Agriculture';
  location = 'Mexico (Remote)';
  email = 'valenzuelacastrojuanpablo@gmail.com';

  about =
    'Software Engineer with 3+ years building cloud-native systems on GCP, microservices, and data-oriented pipelines. Experienced integrating ML models into production workflows for precision agriculture applications. Seeking backend/cloud and AI systems roles.';

  skills = ['Node.js', 'Python', 'FastAPI', 'GCP', 'Docker', 'Microservices', 'ML Pipelines', 'Angular'];
}
