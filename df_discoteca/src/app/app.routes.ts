import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterInfoComponent } from './features/auth/pages/register/register-info/register-info.component';
import { RegisterPayComponent } from './features/auth/pages/register/register-pay/register-pay.component';
import { MenuPrincipalComponent } from './features/menu-principal/menu-principal.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'register',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'info'
      },
      {
        path: 'info',
        component: RegisterInfoComponent
      },
      {
        path: 'pay',
        component: RegisterPayComponent
      }
    ]
  },
  {
    path: 'menu-principal',
    component: MenuPrincipalComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
