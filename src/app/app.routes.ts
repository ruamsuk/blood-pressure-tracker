import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { BloodListComponent } from './components/blood/blood-list.component';
import { LandingComponent } from './components/landing.component';
import { BloodTabComponent } from './components/blood/blood-tab.component';
import { UserListComponent } from './components/user/user-list.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'blood',
    component: BloodTabComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'home',
    component: LandingComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'user',
    component: UserListComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
