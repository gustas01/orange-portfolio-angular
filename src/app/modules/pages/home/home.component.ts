import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { StoreService } from 'app/services/store.service';
import { Projects, UserDataType } from 'app/types/user-data-type';
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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  userData = signal<UserDataType>(this.storeService.getCurrentUser());
  user_avatar = signal<string>(this.userData()?.avatarUrl ?? 'assets/user_icon_2.png');
  myProjects = signal(this.userData()?.projects ?? []);

  tags = signal<TagType[]>([]);

  constructor(
    private httpClient: HttpClient,
    private storeService: StoreService,
    private authService: AuthService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    const response = this.httpClient.get(`${environment.baseUrl}/tags`, { withCredentials: true });
    response.subscribe({
      next: (res) => {
        const allTags: TagType[] = res.valueOf() as TagType[];
        this.tags.set(allTags);
      },
    });
    this.authService.me().subscribe({
      next: (res) => {
        this.userData.set(res);
        this.myProjects.set(this.userData()?.projects ?? []);
      },
    });
  }

  filterProjectsByTags(filteredtags: WritableSignal<string[]>) {
    // this.filteredtags.set(this.tags().filter((tag) => filteredtags().includes(tag.tagName)));

    this.myProjects.set(
      this.projectService.filterProjectsByTags(
        this.userData()?.projects as Projects[],
        filteredtags
      )
    );
  }
}
