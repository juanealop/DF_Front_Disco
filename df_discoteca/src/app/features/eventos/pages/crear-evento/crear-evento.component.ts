import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth/auth.service';
import { EventosService } from '../../../../core/services/eventos/eventos.service';
import { SedesService } from '../../../../core/services/sedes/sedes.service';
import { CrearEventoDTO } from '../../../../core/dtos/eventos/crear-evento.dto';
import { Sede } from '../../../../core/models/sede.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { TextfieldComponent } from '../../../../shared/components/textfield/textfield.component';

@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [FormsModule, ButtonComponent, TextfieldComponent],
  templateUrl: './crear-evento.component.html',
  styleUrl: './crear-evento.component.scss'
})
export class CrearEventoComponent implements OnInit {

  // ============================================================
  // DATOS DEL FORMULARIO
  // ============================================================

  nombre = '';
  descripcion = '';
  direccion = '';
  ciudad = '';

  /** Sede a la que pertenece el evento (relación obligatoria). */
  idSede: number | null = null;

  /** ¿Quieres programarlo? Si está apagado el evento no lleva fechas. */
  programar = false;

  /** Valores de los inputs datetime-local ("YYYY-MM-DDTHH:mm"). */
  fechaInicio = '';
  fechaFin = '';

  // ============================================================
  // SEDES DISPONIBLES
  // ============================================================

  sedes: Sede[] = [];

  // ============================================================
  // ESTADO
  // ============================================================

  cargandoSedes = false;
  cargando = false;
  error = '';

  constructor(
    private readonly router: Router,
    private readonly eventosService: EventosService,
    private readonly sedesService: SedesService,
    private readonly authService: AuthService
  ) {}

  // ============================================================
  // CARGA INICIAL
  // ============================================================

  ngOnInit(): void {
    const idDiscoteca = this.authService.getUsuarioId();

    if (idDiscoteca === null) {
      return;
    }

    this.cargandoSedes = true;

    this.sedesService.obtenerPorDiscoteca(idDiscoteca).subscribe({
      next: (sedes) => {
        this.cargandoSedes = false;
        this.sedes = sedes;

        // Si solo hay una sede, la preseleccionamos.
        if (sedes.length === 1) {
          this.idSede = sedes[0].idSede;
        }
      },
      error: (err: unknown) => {
        console.error(err);
        this.cargandoSedes = false;
        this.error = 'No se pudieron cargar las sedes.';
      }
    });
  }

  // ============================================================
  // FECHAS PROGRAMADAS
  // ============================================================

  get tieneFechasProgramadas(): boolean {
    return this.programar && !!this.fechaInicio && !!this.fechaFin;
  }

  /**
   * Convierte el valor de un input datetime-local (sin segundos) al
   * formato LocalDateTime que espera el backend: "YYYY-MM-DDTHH:mm:ss".
   */
  private aLocalDateTime(valor: string): string | null {
    if (!valor) {
      return null;
    }
    return valor.length === 16 ? `${valor}:00` : valor;
  }

  // ============================================================
  // CREAR EVENTO
  // ============================================================

  crearEvento(): void {

    if (this.cargando) {
      return;
    }

    this.error = '';

    if (!this.nombre.trim()) {
      this.error = 'El nombre del evento es obligatorio.';
      return;
    }

    if (this.idSede === null) {
      this.error = 'Selecciona la sede del evento.';
      return;
    }

    if (this.programar) {
      if (!this.fechaInicio || !this.fechaFin) {
        this.error = 'Indica la fecha de inicio y la fecha final del evento.';
        return;
      }

      if (new Date(this.fechaFin) < new Date(this.fechaInicio)) {
        this.error = 'La fecha final debe ser posterior a la fecha de inicio.';
        return;
      }
    }

    this.cargando = true;

    const dto: CrearEventoDTO = {
      nombre: this.nombre.trim(),
      descripcion: this.descripcion.trim(),
      direccion: this.direccion.trim(),
      ciudad: this.ciudad.trim(),
      fechaInicio: this.programar ? this.aLocalDateTime(this.fechaInicio) : null,
      fechaFin: this.programar ? this.aLocalDateTime(this.fechaFin) : null,
      idSede: this.idSede
    };

    this.eventosService.crearEvento(dto).subscribe({
      next: () => {
        this.cargando = false;
        void this.router.navigate(['/menu-principal']);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.cargando = false;
        this.error = err.status === 401
          ? 'Tu sesión expiró. Inicia sesión nuevamente para crear un evento.'
          : err.error?.message ?? 'No se pudo crear el evento. Verifica los datos e intenta de nuevo.';
      }
    });
  }

  volver(): void {
    void this.router.navigate(['/menu-principal']);
  }

}
