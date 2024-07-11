import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, throwError } from 'rxjs';
import { SnackbarMessageComponent } from './snackbar-message/snackbar-message.component';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err) => {
      snackBar.open(err.error.message, 'X', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 5000,
        panelClass: ['msg-error'],
      });

      return of();
    })
  );
};
