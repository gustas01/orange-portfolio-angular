import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginType } from 'app/types/login-type';
import { RegisterType } from 'app/types/register-type';
import { UserDataType } from 'app/types/user-data-type';

import { environment } from 'environments/environment.dev';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  login(loginData: LoginType) {
    return this.httpClient.post(`${environment.baseUrl}/auth/login`, loginData, {
      withCredentials: true,
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
        this.router.navigate(['login']);

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

  me(): Observable<UserDataType> {
    return this.httpClient.get<UserDataType>(`${environment.baseUrl}/users/me/data`, {
      withCredentials: true,
    });
  }

  loginGoogle() {
    window.location.href = `${environment.baseUrl}/auth/login/google`;
  }
}
