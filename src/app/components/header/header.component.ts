import { Component, effect, OnInit, signal } from '@angular/core';
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
  userData = signal<UserDataType>(this.storeService.getCurrentUser());
  user_avatar = signal<string>(this.userData()?.avatarUrl ?? 'assets/user_icon_2.png');

  constructor(private storeService: StoreService, private authService: AuthService) {
    effect(
      () => {
        this.userData.set(this.storeService.getCurrentUser());
        this.user_avatar.set(this.userData()?.avatarUrl ?? 'assets/user_icon_2.png');
      },
      { allowSignalWrites: true }
    );
  }

  logout() {
    this.authService.logout();
  }
}
