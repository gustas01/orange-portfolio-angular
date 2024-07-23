import { Component, computed, effect, OnInit, signal, WritableSignal } from '@angular/core';
import { StoreService } from 'app/services/store.service';
import { Project, UserDataType } from 'app/types/user-data-type';
import { MatInputModule } from '@angular/material/input';
import { AutocompleteChipsFormComponent } from 'app/components/autocomplete-chips-form/autocomplete-chips-form.component';
import { TagType } from 'app/types/tag-type';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.dev';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from 'app/modules/auth/auth.service';
import { ProjectService } from 'app/services/project.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectDialogComponent } from 'app/components/project-dialog/project-dialog.component';
import { forkJoin } from 'rxjs';

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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  userData = computed(() => this.storeService.userData());
  user_avatar = computed(() => this.userData()?.avatarUrl ?? 'assets/user_icon_2.png');
  myProjects = signal(this.userData()?.projects ?? []);

  tags = signal<TagType[]>([]);

  constructor(
    private httpClient: HttpClient,
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
      },
    });
  }

  filterProjectsByTags(filteredtags: WritableSignal<string[]>) {
    // this.filteredtags.set(this.tags().filter((tag) => filteredtags().includes(tag.tagName)));

    this.myProjects.set(
      this.projectService.filterProjectsByTags(this.userData()?.projects as Project[], filteredtags)
    );
  }

  openDialog() {
    this.dialog.open(ProjectDialogComponent, {
      data: {
        tags: this.tags,
      },
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      minWidth: '60%',
      maxWidth: 'none',
    });
  }
}
