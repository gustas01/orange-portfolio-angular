import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AutocompleteChipsFormComponent } from 'app/components/autocomplete-chips-form/autocomplete-chips-form.component';
import { ShowProjectDetailsDialogComponent } from 'app/components/show-project-details-dialog/show-project-details-dialog.component';
import { ProjectService } from 'app/services/project.service';
import { TagType } from 'app/types/tag-type';
import { Project } from 'app/types/user-data-type';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-discovery',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    AutocompleteChipsFormComponent,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  templateUrl: './discovery.component.html',
  styleUrl: './discovery.component.scss',
})
export class DiscoveryComponent implements OnInit {
  tags = signal<TagType[]>([]);
  discoveryProjects = signal<Project[]>([]);
  allDiscoveryProjects = signal<Project[]>([]);

  loading = signal(true);

  page = signal(0);
  pageSize = signal(10);
  totalElements = signal(0);

  constructor(private projectService: ProjectService, private dialog: MatDialog) {}

  ngOnInit(): void {
    forkJoin([this.projectService.discoveryProjects(), this.projectService.getTags()]).subscribe({
      next: ([res1, res2]) => {
        this.discoveryProjects.set(res1.content as Project[]);
        this.allDiscoveryProjects.set(res1.content as Project[]);

        this.page.set(res1.number);
        this.totalElements.set(res1.totalElements);

        this.tags.set(res2.valueOf() as TagType[]);
        this.loading.set(false);
      },
    });
  }

  filterProjectsByTags(filteredtags: WritableSignal<string[]>) {
    this.discoveryProjects.set(
      this.projectService.filterProjectsByTags(
        this.allDiscoveryProjects() as Project[],
        filteredtags
      )
    );
  }

  open_project_details(project: Project) {
    const tags = project.tags.map((el) => el.tagName);

    const dialog = this.dialog.open(ShowProjectDetailsDialogComponent, {
      data: { project: { ...project, tags } },
      minWidth: '80%',
      maxWidth: 'none',
      autoFocus: false,
    });
  }

  handlePageEvent(e: PageEvent) {
    this.loading.set(true);
    this.page.set(e.pageIndex);
    this.pageSize.set(e.pageSize);

    this.projectService.discoveryProjects(this.page(), this.pageSize()).subscribe({
      next: (res) => {
        this.discoveryProjects.set(res.content as Project[]);
        this.allDiscoveryProjects.set(res.content as Project[]);
        this.loading.set(false);
      },
    });
  }
}
