import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  // ============================================================
  // DATOS DEL FORMULARIO
  // ============================================================

  email: string = '';

  password: string = '';

  // ============================================================
  // ESTADO DEL LOGIN
  // ============================================================

  cargando: boolean = false;

  error: string = '';

  // ============================================================
  // LOGIN
  // ============================================================

  login(): void {

    if (this.cargando) {
      return;
    }

    this.cargando = true;
    this.error = '';

    this.authService.login(this.email.trim(), this.password).subscribe({
      next: () => {
        this.cargando = false;
        void this.router.navigate(['/menu-principal']);
      },
      error: (err: unknown) => {
        console.error(err);
        this.cargando = false;
        this.error = 'No se pudo iniciar sesión. Verifica tu correo y contraseña.';
      }
    });
  }

  // ============================================================
  // REGISTRO
  // ============================================================

  goToRegister(): void {
    void this.router.navigate(['/register/info']);
  }

}
