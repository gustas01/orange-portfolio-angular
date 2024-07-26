import { Component, inject, Inject, signal, WritableSignal } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  MAT_DIALOG_DATA,
  MatDialog,
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from 'app/types/user-data-type';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { ShowProjectDetailsDialogComponent } from '../show-project-details-dialog/show-project-details-dialog.component';

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
  thumbnailImage = signal<string | null>(this.data.project.thumbnailUrl);
  thumbnailFile = signal<File | null>(null);
  loading = signal(false);
  readonly dialog = inject(MatDialog);

  errorMessageTitle = signal('');
  errorMessageUrl = signal('');
  errorMessageDescription = signal('');

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tags: WritableSignal<TagType[]>;
      projectServiceCallback: (
        project: CreateProjectDTO,
        file?: File,
        id?: string
      ) => Observable<Project>;
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
      .projectServiceCallback(
        newProject as CreateProjectDTO,
        this.thumbnailFile() as File,
        this.data.project.id
      )
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

  onFileUpload(event: Event) {
    const content = event.target as HTMLInputElement;
    if (content.files && content.files.length > 0) {
      const file = content.files[0];

      this.thumbnailImage.set(URL.createObjectURL(file));
      this.thumbnailFile.set(file);
    }
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

  openDialogShowPub() {
    const tags = this.data.project.tags.map((el) => el.tagName);

    this.dialog.open(ShowProjectDetailsDialogComponent, {
      data: {
        project: this.data.project.id
          ? {
              ...this.data.project,
              tags,
            }
          : {
              ...this.projectForm.value,
              tags: this.selectedTags(),
              thumbnailUrl: this.thumbnailImage(),
            },
      },
      minWidth: '80%',
      maxWidth: 'none',
    });
  }
}
