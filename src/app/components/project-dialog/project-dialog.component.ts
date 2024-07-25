import { Component, Inject, signal, WritableSignal } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
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
import { Observable } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatInputModule,
    MatAutocompleteModule,
    AutocompleteChipsFormComponent,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './project-dialog.component.html',
  styleUrl: './project-dialog.component.scss',
})
export class ProjectDialogComponent {
  selectedTags = signal<string[]>(this.data.project.tags.map((t) => t.tagName));
  preSelectedTags = signal<string[]>(this.data.project.tags.map((t) => t.tagName));

  loading = signal(false);

  errorMessageTitle = signal('');
  errorMessageUrl = signal('');
  errorMessageDescription = signal('');

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tags: WritableSignal<TagType[]>;
      projectServiceCallback: (project: CreateProjectDTO, id?: string) => Observable<Project>;
      userDataManipulationCallback: (project: Project) => void;
      templateData: {
        dialogTitle: string;
        toastMessage: string;
      };
      project: Project;
    },
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ProjectDialogComponent>
  ) {}

  projectForm = this.formBuilder.group({
    title: [this.data.project.title, [Validators.required, Validators.pattern(/^.{3,30}$/)]],
    url: [this.data.project.url, [Validators.required]],
    description: [
      this.data.project.description,
      [Validators.required, Validators.pattern(/^.{3,350}$/)],
    ],
  });

  selectTags(selectedTags: WritableSignal<string[]>) {
    this.selectedTags.set(selectedTags());
  }

  saveProject() {
    this.loading.set(true);
    const newProject = { ...this.projectForm.value, tags: this.selectedTags() };
    this.data
      .projectServiceCallback(newProject as CreateProjectDTO, this.data.project.id)
      .subscribe({
        next: (res) => {
          this.snackBar.open(this.data.templateData.toastMessage, 'X', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: 'msg-success',
          });

          this.data.userDataManipulationCallback(res);
          this.dialogRef.close();
          this.loading.set(false);
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
