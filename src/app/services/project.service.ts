import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal } from '@angular/core';
import { CreateProjectDTO } from 'app/types/create-project.dto';
import { Pageable } from 'app/types/projects-page-type';
import { Project } from 'app/types/user-data-type';
import { environment } from 'environments/environment.dev';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private httpClient: HttpClient) {}

  filterProjectsByTags(projects: Project[], filteredtags: WritableSignal<string[]>) {
    const filteredProjects: Project[] = [];
    filteredtags().forEach((t) => {
      const actualFilteredProjects = projects?.filter(
        (p) =>
          p.tags.map((el) => el.tagName).includes(t) &&
          !filteredProjects?.some((i) => i.id === p.id)
      );
      if (actualFilteredProjects?.length) filteredProjects.push(...actualFilteredProjects);
    });

    if (filteredtags().length === 0) return projects;
    else return filteredProjects;
  }

  createProject(projectData: CreateProjectDTO) {
    const form = new FormData();
    form.append('data', new Blob([JSON.stringify(projectData)], { type: 'application/json' }));

    return this.httpClient.post(`${environment.baseUrl}/projects`, form, {
      withCredentials: true,
    });
  }

  getProjects(): Observable<Pageable<Project>> {
    return this.httpClient.get<Pageable<Project>>(`${environment.baseUrl}/projects/me/data`, {
      withCredentials: true,
    });
  }

  getTags() {
    return this.httpClient.get(`${environment.baseUrl}/tags`, { withCredentials: true });
  }
}