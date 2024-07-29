import { Routes } from '@angular/router';
import { LoginComponent } from './modules/pages/login/login.component';
import { RegisterComponent } from './modules/pages/register/register.component';
import { HomeComponent } from './modules/pages/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { ProfileComponent } from './modules/pages/profile/profile.component';
import { DiscoveryComponent } from './modules/pages/discovery/discovery.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '',
    component: HeaderComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'discovery',
        component: DiscoveryComponent,
      },
    ],
  },
];
