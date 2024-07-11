import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private storeService: StoreService
  ) {}

  ngOnDestroy(): void {
    //desinscrever do observable de login
    throw new Error('Method not implemented.');
  }

  private jsonHeaders = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  };

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
          //TODO: salvar os dados do usuário em algum lugar e navigate para a home
          this.storeService.setCurrentUser(res as UserDataType);
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
}
