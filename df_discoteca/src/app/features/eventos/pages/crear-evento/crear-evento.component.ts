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
import { DatefieldComponent } from '../../../../shared/components/datefield/datefield.component';

@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [FormsModule, ButtonComponent, TextfieldComponent, DatefieldComponent],
  templateUrl: './crear-evento.component.html',
  styleUrl: './crear-evento.component.scss'
})
export class CrearEventoComponent implements OnInit {

  /** Máximo de imágenes que se pueden subir (según la maqueta). */
  readonly maxImagenes = 8;

  // ============================================================
  // DATOS DEL FORMULARIO
  // ============================================================

  nombre = '';
  descripcion = '';

  /** Sede a la que pertenece el evento (relación obligatoria). */
  idSede: string | null = null;

  // ============================================================
  // PROGRAMACIÓN
  // ============================================================

  /** ¿Quieres programarlo? Si está apagado el evento no lleva fechas. */
  programar = false;

  /** Valores de los inputs datetime-local ("YYYY-MM-DDTHH:mm"). */
  fechaInicio = '';
  fechaFin = '';

  /** Fecha que se está agregando a "Fechas programadas". */
  fechaFinProgramacion = '';
  frecuencia: 'DIARIA' | 'SEMANAL' | 'QUINCENAL' | 'MENSUAL' = 'SEMANAL';

  // ============================================================
  // IMÁGENES (lógica de front)
  // ============================================================

  imagenes: { nombre: string; url: string }[] = [];

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
  // FECHAS PROGRAMADAS (lógica de front)
  // ============================================================

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
  // IMÁGENES (lógica de front)
  // ============================================================

  onImagenesSeleccionadas(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    for (const file of files) {
      if (this.imagenes.length >= this.maxImagenes) {
        break;
      }

      if (!file.type.startsWith('image/')) {
        continue;
      }

      this.imagenes.push({
        nombre: file.name,
        url: URL.createObjectURL(file)
      });
    }

    // Permitir volver a seleccionar el mismo archivo.
    input.value = '';
  }

  quitarImagen(index: number): void {
    const [imagen] = this.imagenes.splice(index, 1);

    if (imagen) {
      URL.revokeObjectURL(imagen.url);
    }
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

    if (!this.fechaInicio || !this.fechaFin) {
      this.error = 'Indica la fecha de inicio y la fecha final del evento.';
      return;
    }

    if (new Date(this.fechaFin) < new Date(this.fechaInicio)) {
      this.error = 'La fecha final debe ser posterior a la fecha de inicio.';
      return;
    }

    if (this.programar && !this.fechaFinProgramacion) {
      this.error = 'Indica hasta cuándo se repetirá el evento.';
      return;
    }

    if (this.programar && new Date(this.fechaFinProgramacion) < new Date(this.fechaInicio)) {
      this.error = 'La fecha final de programación debe ser igual o posterior al inicio del evento.';
      return;
    }

    this.cargando = true;

    const dto: CrearEventoDTO = {
      nombre: this.nombre.trim(),
      descripcion: this.descripcion.trim(),
      fechaInicio: this.aLocalDateTime(this.fechaInicio),
      fechaFin: this.aLocalDateTime(this.fechaFin),
      idSede: this.idSede,
      urls: this.imagenes.map((imagen) => imagen.url),
      programacionEvento: this.programar ? {
        nombre: this.nombre.trim(),
        descripcion: this.descripcion.trim(),
        fechaInicioProgramacion: this.aLocalDateTime(this.fechaInicio)!,
        fechaFinProgramacion: this.aLocalDateTime(this.fechaFinProgramacion)!,
        frecuencia: this.frecuencia
      } : null
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
