import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProjectService } from 'app/services/project.service';
import { StoreService } from 'app/services/store.service';
import { LoginType } from 'app/types/login-type';
import { Pageable } from 'app/types/projects-page-type';
import { RegisterType } from 'app/types/register-type';
import { Project, UserDataType } from 'app/types/user-data-type';

import { environment } from 'environments/environment.dev';
import { forkJoin, Observable, switchMap } from 'rxjs';

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
}
