import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { LoginType } from 'app/types/login-type';

import { environment } from 'environments/environment.dev';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  constructor(private httpClient: HttpClient) {}

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
    const response = this.httpClient.post(
      `${environment.baseUrl}/auth/login`,
      loginData,
      { withCredentials: true }
    );

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
          console.log('res');
          console.log(res);
        },
      });
  }
}
