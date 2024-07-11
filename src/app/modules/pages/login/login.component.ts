import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { AuthService } from 'app/modules/auth/auth.service';
import { LoginType } from 'app/types/login-type';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  loginForm = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%¨&*(){}^+=])(?=\S+$).{8,}$/
      ),
    ]),
  });

  errorMessageEmail = signal('');
  errorMessagePassword = signal('');
  hide = signal(true);

  updateErrorMessageEmail() {
    if (this.loginForm.get('email')?.hasError('required')) {
      this.errorMessageEmail.set('Email obrigatório');
    } else if (this.loginForm.get('email')?.hasError('email')) {
      this.errorMessageEmail.set('Entre com um email válido');
    } else {
      this.errorMessageEmail.set('');
    }
  }

  updateErrorMessagePassword() {
    if (this.loginForm.get('password')?.hasError('required')) {
      this.errorMessagePassword.set('Senha obrigatória');
    } else if (this.loginForm.get('password')?.hasError('minlength')) {
      this.errorMessagePassword.set('A senha deve ter pelo menos 8 caracteres');
    } else if (this.loginForm.get('password')?.hasError('pattern')) {
      this.errorMessagePassword.set(
        'A senha deve conter no mínimo 1 letra maiúscula, 1 minúscula, 1 número e 1 símbolo pelo menos'
      );
    } else {
      this.errorMessagePassword.set('');
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  login() {
    const loginData: LoginType = this.loginForm.value as LoginType;
    if (this.loginForm.valid) this.authService.login(loginData);
  }
}
