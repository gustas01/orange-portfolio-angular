import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { AuthService } from 'app/modules/auth/auth.service';
import { RegisterType } from 'app/types/register-type';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(private formBuilder: FormBuilder, private authService: AuthService) {}

  registerForm = this.formBuilder.group({
    firstName: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    lastName: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%¨&*(){}^+=])(?=\S+$).{8,}$/),
    ]),
  });

  errorMessageFirstName = signal('');
  errorMessageLastName = signal('');
  errorMessageEmail = signal('');
  errorMessagePassword = signal('');
  hide = signal(true);

  updateErrorMessageFirstName() {
    if (this.registerForm.get('firstName')?.hasError('required')) {
      this.errorMessageFirstName.set('Nome obrigatório');
    } else if (this.registerForm.get('firstName')?.hasError('maxlength')) {
      this.errorMessageFirstName.set('O nome não pode ter mais 30 caracteres');
    } else {
      this.errorMessageFirstName.set('');
    }
  }

  updateErrorMessageLastName() {
    if (this.registerForm.get('lastName')?.hasError('required')) {
      this.errorMessageLastName.set('Sobrenome obrigatório');
    } else if (this.registerForm.get('lastName')?.hasError('maxlength')) {
      this.errorMessageLastName.set('O sobrenome não pode ter mais 30 caracteres');
    } else {
      this.errorMessageLastName.set('');
    }
  }

  updateErrorMessageEmail() {
    if (this.registerForm.get('email')?.hasError('required')) {
      this.errorMessageEmail.set('Email obrigatório');
    } else if (this.registerForm.get('email')?.hasError('email')) {
      this.errorMessageEmail.set('Entre com um email válido');
    } else {
      this.errorMessageEmail.set('');
    }
  }

  updateErrorMessagePassword() {
    if (this.registerForm.get('password')?.hasError('required')) {
      this.errorMessagePassword.set('Senha obrigatória');
    } else if (this.registerForm.get('password')?.hasError('minlength')) {
      this.errorMessagePassword.set('A senha deve ter pelo menos 8 caracteres');
    } else if (this.registerForm.get('password')?.hasError('pattern')) {
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

  register() {
    this.authService.register(this.registerForm.value as RegisterType);
  }
}
