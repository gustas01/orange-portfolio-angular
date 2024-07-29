import { Injectable, OnInit, signal } from '@angular/core';
import { AuthService } from 'app/modules/auth/auth.service';
import { UserDataType } from 'app/types/user-data-type';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  userData = signal<UserDataType>(null);

  constructor(private authService: AuthService) {
    this.authService.me().subscribe({
      next: (res) => {
        this.userData.set(res);
      },
    });
  }
}
