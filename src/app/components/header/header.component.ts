import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AuthService } from 'app/modules/auth/auth.service';
import { StoreService } from 'app/services/store.service';
import { UserDataType } from 'app/types/user-data-type';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatRippleModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  userData = computed(() => this.storeService.userData());
  user_avatar = computed(() => this.userData()?.avatarUrl ?? 'assets/user_icon_2.png');

  constructor(private storeService: StoreService, private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
