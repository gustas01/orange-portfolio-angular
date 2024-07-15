import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StoreService } from 'app/services/store.service';
import { LoginType } from 'app/types/login-type';
import { RegisterType } from 'app/types/register-type';
import { UserDataType } from 'app/types/user-data-type';

import { environment } from 'environments/environment.dev';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  constructor(
    private httpClient: HttpClient,
    private _snackBar: MatSnackBar,
    private storeService: StoreService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    //desinscrever do observable de login
    throw new Error('Method not implemented.');
  }

  login(loginData: LoginType) {
    const response = this.httpClient.post(`${environment.baseUrl}/auth/login`, loginData, {
      withCredentials: true,
    });

    response
      .pipe(
        switchMap((res) =>
          this.httpClient.get(`${environment.baseUrl}/users/me/data`, {
            withCredentials: true,
          })
        )
      )
      .subscribe({
        next: (res) => {
          this.storeService.setCurrentUser(res as UserDataType);
          this.router.navigate(['home']);
        },
      });
  }

  register(registerData: RegisterType) {
    const form = new FormData();
    form.append('data', new Blob([JSON.stringify(registerData)], { type: 'application/json' }));

    const response = this.httpClient.post(`${environment.baseUrl}/auth/register`, form, {
      withCredentials: true,
    });

    response.subscribe({
      next: (res) => {
        this._snackBar.open('Usuário criado com sucesso!', 'X', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'msg-success',
        });
      },
    });
  }

  logout() {
    const response = this.httpClient.post(`${environment.baseUrl}/auth/logout`, null, {
      withCredentials: true,
    });

    response.subscribe({
      next: (res) => {
        this.storeService.removeCurrentUser();
        this.router.navigate(['']);

        type responseType = { message: string };
        const message: responseType = res.valueOf() as responseType;

        this._snackBar.open(message.message, 'X', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'msg-success',
        });
      },
    });
  }
}
