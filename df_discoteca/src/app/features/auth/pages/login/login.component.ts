import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

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

    // TODO:
    // Navegar hacia la página de registro.

  }

}