import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal } from '@angular/core';
import { Projects } from 'app/types/user-data-type';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private httpCliente: HttpClient) {}

  filterProjectsByTags(projects: Projects[], filteredtags: WritableSignal<string[]>) {
    const filteredProjects: Projects[] = [];
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
}
