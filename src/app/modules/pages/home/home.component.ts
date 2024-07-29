import { Component, computed, effect, OnInit, signal, WritableSignal } from '@angular/core';
import { StoreService } from 'app/services/store.service';
import { Project, UserDataType } from 'app/types/user-data-type';
import { MatInputModule } from '@angular/material/input';
import { AutocompleteChipsFormComponent } from 'app/components/autocomplete-chips-form/autocomplete-chips-form.component';
import { TagType } from 'app/types/tag-type';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from 'app/modules/auth/auth.service';
import { ProjectService } from 'app/services/project.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectDialogComponent } from 'app/components/project-dialog/project-dialog.component';
import { forkJoin } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmationDialogComponent } from 'app/components/confirmation-dialog/confirmation-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { CreateProjectDTO } from 'app/types/create-project.dto';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    AutocompleteChipsFormComponent,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  userData = computed(() => this.storeService.userData());
  user_avatar = computed(() => this.userData()?.avatarUrl ?? 'assets/user_icon_2.png');
  myProjects = signal(this.userData()?.projects ?? []);
  tags = signal<TagType[]>([]);

  loading = signal(true);

  constructor(
    private storeService: StoreService,
    private authService: AuthService,
    private projectService: ProjectService,
    private dialog: MatDialog
  ) {
    effect(
      () => {
        this.myProjects.set(this.userData()?.projects ?? []);
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    forkJoin([
      this.authService.me(),
      this.projectService.getProjects(),
      this.projectService.getTags(),
    ]).subscribe({
      next: ([res1, res2, res3]) => {
        const userData = { ...res1, projects: res2.content };

        this.storeService.userData.set(userData as UserDataType);

        const allTags: TagType[] = res3.valueOf() as TagType[];
        this.tags.set(allTags);

        this.loading.set(false);
      },
    });

    // this.loading.set()
  }

  filterProjectsByTags(filteredtags: WritableSignal<string[]>) {
    // this.filteredtags.set(this.tags().filter((tag) => filteredtags().includes(tag.tagName)));

    this.myProjects.set(
      this.projectService.filterProjectsByTags(this.userData()?.projects as Project[], filteredtags)
    );
  }

  openDialogCreateProject() {
    this.dialog.open(ProjectDialogComponent, {
      data: {
        tags: this.tags,
        projectServiceCallback: (projectData: CreateProjectDTO, file: File) =>
          this.projectService.createProject(projectData, file),
        userDataManipulationCallback: (project: Project) =>
          this.addProjectToUserDataCallback(project),
        templateData: {
          dialogTitle: 'Adicionar projeto',
          toastMessage: 'Projeto criado com sucesso!',
        },
        project: { tags: [] },
      },
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      minWidth: '60%',
      maxWidth: 'none',
    });
  }

  openDialogUpdateProject(project: Project) {
    this.dialog.open(ProjectDialogComponent, {
      data: {
        tags: this.tags,
        projectServiceCallback: (body: CreateProjectDTO, file: File, projectId: string) =>
          this.projectService.updateProject(body, file, projectId),
        userDataManipulationCallback: (project: Project) => this.updateProjectFronUserData(project),
        templateData: {
          dialogTitle: 'Editar projeto',
          toastMessage: 'Edição concluída com sucesso!',
        },
        project,
      },
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      minWidth: '60%',
      maxWidth: 'none',
    });
  }

  openDialogDeleteProject(projectId: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      restoreFocus: false,
      data: { projectId },
    });
  }

  addProjectToUserDataCallback(project: Project) {
    this.storeService.userData.set({
      ...this.storeService.userData(),
      projects: [...(this.storeService.userData()?.projects as Project[]), project],
    } as UserDataType);
  }

  updateProjectFronUserData(project: Project) {
    if (this.storeService.userData()?.projects.some((el) => el.id === project.id)) {
      const projects = this.storeService
        .userData()
        ?.projects.filter((el) => el.id !== project.id) as Project[];

      projects.push(project);

      this.storeService.userData.set({
        ...this.storeService.userData(),
        projects,
      } as UserDataType);
    }
  }
}
