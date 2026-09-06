import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { RegistroDiscotecaStateService } from '../../../services/registro-discoteca-state.service';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { TextfieldComponent } from '../../../../../shared/components/textfield/textfield.component';

@Component({
  selector: 'app-register-info',
  standalone: true,
  imports: [FormsModule, ButtonComponent, TextfieldComponent],
  templateUrl: './register-info.component.html',
  styleUrl: './register-info.component.scss'
})
export class RegisterInfoComponent {

  // ============================================================
  // DATOS DEL FORMULARIO
  // (Todo el CrearDiscotecaDTO excepto la información de pago)
  // ============================================================

  nombre: string = '';

  descripcion: string = '';

  telefono: string = '';

  email: string = '';

  direccion: string = '';

  contrasena: string = '';

  pais: string = '';

  ciudad: string = '';

  constructor(
    private readonly router: Router,
    private readonly state: RegistroDiscotecaStateService
  ) {}

  // ============================================================
  // CONTINUAR AL PASO DE PAGO
  // ============================================================

  continuar(): void {

    this.state.guardarInfo({
      nombre: this.nombre.trim(),
      descripcion: this.descripcion.trim(),
      telefono: this.telefono.trim(),
      email: this.email.trim(),
      direccion: this.direccion.trim(),
      contrasena: this.contrasena,
      pais: this.pais.trim(),
      ciudad: this.ciudad.trim()
    });

    void this.router.navigate(['/register/pay']);
  }

  // ============================================================
  // VOLVER AL LOGIN
  // ============================================================

  irAlLogin(): void {
    void this.router.navigate(['/']);
  }
}
