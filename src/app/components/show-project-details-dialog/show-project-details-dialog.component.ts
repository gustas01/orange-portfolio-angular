import { CommonModule } from '@angular/common';
import { Component, computed, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { StoreService } from 'app/services/store.service';
import { Project } from 'app/types/user-data-type';

@Component({
  selector: 'app-show-project-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatChipsModule, MatButtonModule],
  templateUrl: './show-project-details-dialog.component.html',
  styleUrl: './show-project-details-dialog.component.scss',
})
export class ShowProjectDetailsDialogComponent {
  userData = computed(() => this.storeService.userData());

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { project: Project },
    private storeService: StoreService
  ) {}
}
