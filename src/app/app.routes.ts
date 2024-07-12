import { Routes } from '@angular/router';
import { LoginComponent } from './modules/pages/login/login.component';
import { RegisterComponent } from './modules/pages/register/register.component';
import { HomeComponent } from './modules/pages/home/home.component';
import { HeaderComponent } from './components/header/header.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HeaderComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
    ],
  },
];
