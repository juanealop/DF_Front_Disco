import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CrearDiscotecaDTO } from '../../../../../core/dtos/discoteca/discoteca-create.dto';
import { Discoteca } from '../../../../../core/models/discoteca.model';
import { DiscotecaService } from '../../../../../core/services/discoteca/discoteca.service';
import { InfoRegistroDiscoteca, RegistroDiscotecaStateService } from '../../../services/registro-discoteca-state.service';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { TextfieldComponent } from '../../../../../shared/components/textfield/textfield.component';

@Component({
  selector: 'app-register-pay',
  standalone: true,
  imports: [FormsModule, ButtonComponent, TextfieldComponent],
  templateUrl: './register-pay.component.html',
  styleUrl: './register-pay.component.scss'
})
export class RegisterPayComponent {

  // ============================================================
  // DATOS DEL FORMULARIO
  // (Información de pago del CrearDiscotecaDTO)
  // ============================================================

  numeroTarjeta: string = '';

  titular: string = '';

  fechaExpiracion: string = '';

  cvv: string = '';

  // ============================================================
  // ESTADO DEL REGISTRO
  // ============================================================

  cargando: boolean = false;

  error: string = '';

  discotecaRegistrada: Discoteca | null = null;

  constructor(
    private readonly router: Router,
    private readonly state: RegistroDiscotecaStateService,
    private readonly discotecaService: DiscotecaService
  ) {}

  // ============================================================
  // DATOS DEL PASO ANTERIOR
  // ============================================================

  get hayInfo(): boolean {
    return this.state.info !== null;
  }

  get info(): InfoRegistroDiscoteca | null {
    return this.state.info;
  }

  // ============================================================
  // REGISTRAR DISCO TECA
  // ============================================================

  registrar(): void {

    const info = this.state.info;

    if (!info || this.cargando) {
      return;
    }

    this.cargando = true;
    this.error = '';

    const dto: CrearDiscotecaDTO = {
      ...info,
      numeroTarjeta: this.numeroTarjeta.replace(/\s/g, ''),
      titular: this.titular.trim(),
      fechaExpiracion: this.fechaExpiracion.trim(),
      cvv: this.cvv.trim()
    };

    this.discotecaService.crearDiscoteca(dto).subscribe({
      next: (discoteca) => {
        this.cargando = false;
        this.discotecaRegistrada = discoteca;
        this.state.limpiar();
      },
      error: (err: unknown) => {
        console.error(err);
        this.cargando = false;
        this.error = 'No se pudo completar el registro. Verifica los datos e inténtalo de nuevo.';
      }
    });
  }

  // ============================================================
  // NAVEGACIÓN
  // ============================================================

  volverAlPaso1(): void {
    void this.router.navigate(['/register/info']);
  }

  irAlLogin(): void {
    void this.router.navigate(['/']);
  }
}
