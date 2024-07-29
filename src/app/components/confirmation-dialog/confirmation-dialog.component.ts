import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from 'app/services/project.service';
import { StoreService } from 'app/services/store.service';
import { Project, UserDataType } from 'app/types/user-data-type';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatProgressBarModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
  loading = signal(false);

  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: { projectId: string },
    private snackBar: MatSnackBar,
    private storeService: StoreService
  ) {}

  deleteProject(projectId: string) {
    this.loading.set(true);
    this.projectService.deleteProject(projectId).subscribe({
      next: (res) => {
        this.snackBar.open('Projeto deletado com sucesso!', 'X', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'msg-success',
        });
        this.dialogRef.close();
        this.loading.set(false);

        const projects = this.storeService
          .userData()
          ?.projects.filter((el) => el.id !== projectId) as Project[];

        this.storeService.userData.set({
          ...this.storeService.userData(),
          projects,
        } as UserDataType);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }
}
