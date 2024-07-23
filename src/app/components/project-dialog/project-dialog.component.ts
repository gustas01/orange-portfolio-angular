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
import { MatButtonModule } from '@angular/material/button';

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
    MatButtonModule,
  ],
  templateUrl: './project-dialog.component.html',
  styleUrl: './project-dialog.component.scss',
})
export class ProjectDialogComponent {
  selectedTags = signal<string[]>([]);

  errorMessageTitle = signal('');
  errorMessageUrl = signal('');
  errorMessageDescription = signal('');

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tags: WritableSignal<TagType[]> },
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    private storeService: StoreService
  ) {}

  projectForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.pattern(/^.{3,30}$/)]],
    url: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.pattern(/^.{3,350}$/)]],
  });

  selectTags(selectedTags: WritableSignal<string[]>) {
    this.selectedTags.set(selectedTags());
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

        this.storeService.userData.set({
          ...this.storeService.userData(),
          projects: [...(this.storeService.userData()?.projects as Project[]), res],
        } as UserDataType);

        // this.storeService.userData()?.projects.push(res as Project);
      },
    });
  }

  updateMessageTitle() {
    if (this.projectForm.get('title')?.hasError('required'))
      this.errorMessageTitle.set('Título obrigatório!');
    else if (this.projectForm.get('title')?.hasError('pattern'))
      this.errorMessageTitle.set('O título deve ter entre 3 e 30 caracteres!');
  }

  updateMessageUrl() {
    if (this.projectForm.get('url')?.hasError('required'))
      this.errorMessageUrl.set('Url obrigatória!');
  }

  updateMessageDescription() {
    if (this.projectForm.get('description')?.hasError('required'))
      this.errorMessageDescription.set('Descrição obrigatória!');
    else if (this.projectForm.get('description')?.hasError('pattern'))
      this.errorMessageDescription.set('A descrição deve ter entre 3 e 350 caracteres!');
  }
}
