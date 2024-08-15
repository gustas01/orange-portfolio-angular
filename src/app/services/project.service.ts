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

  createProject(projectData: CreateProjectDTO, thumbnaiFile: File): Observable<Project> {
    const form = new FormData();
    form.append('data', new Blob([JSON.stringify(projectData)], { type: 'application/json' }));
    form.append('image', thumbnaiFile);

    return this.httpClient.post<Project>(`${environment.baseUrl}/projects`, form, {
      withCredentials: true,
    });
  }

  getProjects(page: number = 0, size: number = 10): Observable<Pageable<Project>> {
    return this.httpClient.get<Pageable<Project>>(
      `${environment.baseUrl}/projects/data?page=${page}&size=${size}`,
      {
        withCredentials: true,
      }
    );
  }

  getTags() {
    return this.httpClient.get(`${environment.baseUrl}/tags`, { withCredentials: true });
  }

  deleteProject(projectId: string) {
    return this.httpClient.delete(`${environment.baseUrl}/projects/${projectId}`, {
      withCredentials: true,
    });
  }

  updateProject(body: CreateProjectDTO, thumbnaiFile: File, projectId: string) {
    const form = new FormData();
    form.append('data', new Blob([JSON.stringify(body)], { type: 'application/json' }));
    form.append('image', thumbnaiFile);

    return this.httpClient.put(`${environment.baseUrl}/projects/${projectId}`, form, {
      withCredentials: true,
    });
  }

  discoveryProjects(page: number = 0, size: number = 10): Observable<Pageable<Project>> {
    return this.httpClient.get<Pageable<Project>>(
      `${environment.baseUrl}/projects/discovery?page=${page}&size=${size}`,
      {
        withCredentials: true,
      }
    );
  }
}
