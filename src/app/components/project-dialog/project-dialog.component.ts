import { Component, Inject, signal, WritableSignal } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { AutocompleteChipsFormComponent } from '../autocomplete-chips-form/autocomplete-chips-form.component';
import { TagType } from 'app/types/tag-type';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProjectDTO } from 'app/types/create-project.dto';
import { ProjectService } from 'app/services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/modules/auth/auth.service';
import { StoreService } from 'app/services/store.service';
import { Project, UserDataType } from 'app/types/user-data-type';

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatInputModule,
    MatAutocompleteModule,
    AutocompleteChipsFormComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './project-dialog.component.html',
  styleUrl: './project-dialog.component.scss',
})
export class ProjectDialogComponent {
  selectedTags = signal<string[]>([]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tags: WritableSignal<TagType[]> },
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private storeService: StoreService
  ) {
    console.log(data.tags());
  }

  projectForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    url: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  selectTags(selectedTags: WritableSignal<string[]>) {
    this.selectedTags.set(selectedTags());
    console.log(this.selectedTags());
  }

  createProject() {
    const newProject = { ...this.projectForm.value, tags: this.selectedTags() };
    this.projectService.createProject(newProject as CreateProjectDTO).subscribe({
      next: (res) => {
        this.snackBar.open('Projeto criado com sucesso!', 'X', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'msg-success',
        });
        // const userData = this.storeService.userData();
        // userData?.projects.push(res as Project);
        // this.storeService.userData.set(userData);
        // this.storeService.setCurrentUser(userData);
        // const abc = {
        //   ...this.storeService.userData(),
        //   projects: this.storeService.userData()?.projects.push(res as Project),
        // } as unknown as UserDataType;

        this.storeService.userData.set({
          ...this.storeService.userData(),
          projects: [...(this.storeService.userData()?.projects as Project[]), res],
        } as UserDataType);

        // this.storeService.userData()?.projects.push(res as Project);
      },
    });
  }
}
