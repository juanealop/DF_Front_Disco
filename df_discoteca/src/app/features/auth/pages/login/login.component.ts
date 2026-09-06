import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private readonly router: Router) {}

  // ============================================================
  // DATOS DEL FORMULARIO
  // ============================================================

  email: string = '';

  password: string = '';

  // ============================================================
  // LOGIN
  // ============================================================

  login(): void {

    // TODO:
    // Implementar autenticación contra el backend.

  }

  // ============================================================
  // REGISTRO
  // ============================================================

  goToRegister(): void {
    void this.router.navigate(['/register/info']);
  }

}
