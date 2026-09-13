import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterInfoComponent } from './features/auth/pages/register/register-info/register-info.component';
import { RegisterPayComponent } from './features/auth/pages/register/register-pay/register-pay.component';
import { MenuPrincipalComponent } from './features/discoteca/pages/menu-principal/menu-principal.component';
import { CrearSedeComponent } from './features/sedes/pages/crear-sede/crear-sede.component';
import { authGuard, loginRedirectGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [loginRedirectGuard]
  },
  {              //ESTO ES DEVELOP
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
    component: MenuPrincipalComponent,
    canActivate: [authGuard]
  },
  {
    path: 'sedes/crear',
    component: CrearSedeComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
