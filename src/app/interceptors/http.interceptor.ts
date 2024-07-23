import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err) => {
      const messages = String(err.error.message).split(',').join(' - ');
      snackBar.open(messages, 'X', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 5000,
        panelClass: ['msg-error'],
      });
      if (err.error.status === 401) router.navigate(['login']);
      return of();
    })
  );
};
