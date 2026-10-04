import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EventosService } from '../../../../core/services/eventos/eventos.service';
import { SedesService } from '../../../../core/services/sedes/sedes.service';
import { ActualizarEventoDTO } from '../../../../core/dtos/eventos/actualizar-evento.dto';
import { ConsultarEventoDTO } from '../../../../core/dtos/eventos/consultar-evento.dto';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { TextfieldComponent } from '../../../../shared/components/textfield/textfield.component';
import { DatefieldComponent } from '../../../../shared/components/datefield/datefield.component';
import { AdvisorComponent } from '../../../../shared/components/advisor/advisor.component';

@Component({
  selector: 'app-ver-evento',
  standalone: true,
  imports: [FormsModule, ButtonComponent, TextfieldComponent, DatefieldComponent, AdvisorComponent],
  templateUrl: './ver-evento.component.html',
  styleUrl: './ver-evento.component.scss'
})
export class VerEventoComponent implements OnInit {

  /** Máximo de imágenes que se pueden manejar (según la maqueta). */
  readonly maxImagenes = 8;

  // ============================================================
  // IDENTIFICACIÓN
  // ============================================================

  /** id del evento que se está editando (viene por la URL). */
  idEvento: number | null = null;

  /** Nombre de la sede del evento (solo lectura, para el subtítulo). */
  nombreSede = '';

  // ============================================================
  // DATOS DEL FORMULARIO
  // ============================================================

  nombre = '';
  descripcion = '';

  /** Valores de los inputs datetime-local ("YYYY-MM-DDTHH:mm"). */
  fechaInicio = '';
  fechaFin = '';

  /** Imágenes del evento (las del backend + las que se agreguen en el front). */
  imagenes: { nombre: string; url: string; archivo?: File }[] = [];

  // ============================================================
  // ESTADO DEL EVENTO (lo calcula el backend, solo lectura)
  // ============================================================

  activa: boolean | null = null;

  // ============================================================
  // ESTADO DE LA PANTALLA
  // ============================================================

  cargandoEvento = false;
  cargando = false;
  error = '';
  imagenSeleccionada: string | null = null;

  /** Muestra el advisor de confirmación de eliminación. */
  confirmandoEliminar = false;

  /** True mientras se está eliminando el evento. */
  eliminando = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly eventosService: EventosService,
    private readonly sedesService: SedesService
  ) {}

  // ============================================================
  // CARGA INICIAL
  // ============================================================

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.idEvento = idParam !== null && idParam !== '' ? Number(idParam) : null;

    if (this.idEvento === null || Number.isNaN(this.idEvento)) {
      this.error = 'No se encontró el evento.';
      return;
    }

    this.cargandoEvento = true;

    // GET /api/evento/{id}
    this.eventosService.obtenerEvento(this.idEvento).subscribe({
      next: (dto) => {
        this.cargandoEvento = false;
        this.cargarEvento(dto);
      },
      error: (err: unknown) => {
        console.error(err);
        this.cargandoEvento = false;
        this.error = 'No se pudo cargar el evento.';
      }
    });
  }

  /** Vuelca el ConsultarEventoDTO del backend en el formulario. */
  private cargarEvento(dto: ConsultarEventoDTO): void {
    this.nombre = dto.nombre ?? '';

    // OJO: el backend expone "Descripcion" con mayúscula.
    this.descripcion = dto.Descripcion ?? '';

    this.fechaInicio = this.aInputFecha(dto.fechaInicial);
    this.fechaFin = this.aInputFecha(dto.fehaFinal);

    this.imagenes = (dto.urls ?? []).map((url) => ({
      nombre: 'Imagen del evento',
      url
    }));

    this.activa = dto.activa;

    // Nombre de la sede (opcional; si falla, no rompe la pantalla).
    if (dto.idSede != null) {
      this.sedesService.obtenerSede(dto.idSede).subscribe({
        next: (sede) => (this.nombreSede = sede.nombre),
        error: (err: unknown) => console.error('No se pudo cargar la sede.', err)
      });
    }
  }

  // ============================================================
  // FECHAS
  // ============================================================

  /**
   * "YYYY-MM-DDTHH:mm:ss" (LocalDateTime del backend) ->
   * "YYYY-MM-DDTHH:mm" (valor de un input datetime-local).
   */
  private aInputFecha(valor: string | null): string {
    if (!valor) {
      return '';
    }
    return valor.length >= 16 ? valor.slice(0, 16) : valor;
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
  // IMÁGENES (lógica de front, igual que en crear-evento)
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
        url: URL.createObjectURL(file),
        archivo: file
      });
    }

    // Permitir volver a seleccionar el mismo archivo.
    input.value = '';
  }

  quitarImagen(index: number): void {
    const [imagen] = this.imagenes.splice(index, 1);

    // Solo revocamos las que creamos nosotros (blob:).
    if (imagen?.url.startsWith('blob:')) {
      URL.revokeObjectURL(imagen.url);
    }
  }

  verImagen(url: string): void {
    this.imagenSeleccionada = url;
  }

  cerrarImagen(): void {
    this.imagenSeleccionada = null;
  }

  // ============================================================
  // ACTUALIZAR EVENTO
  // ============================================================

  actualizarEvento(): void {

    if (this.cargando || this.idEvento === null) {
      return;
    }

    this.error = '';

    if (!this.nombre.trim()) {
      this.error = 'El nombre del evento es obligatorio.';
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

    const dto: ActualizarEventoDTO = {
      nombre: this.nombre.trim(),
      descripcion: this.descripcion.trim(),
      fechaInicio: this.aLocalDateTime(this.fechaInicio),
      fechaFin: this.aLocalDateTime(this.fechaFin),
      urls: this.imagenes.map((imagen) => imagen.url)
    };

    this.cargando = true;

    // PUT /api/evento/{id}
    this.eventosService.actualizarEvento(this.idEvento, dto).subscribe({
      next: () => {
        this.cargando = false;
        void this.router.navigate(['/menu-principal']);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.cargando = false;
        this.error = err.status === 401
          ? 'Tu sesión expiró. Inicia sesión nuevamente para actualizar el evento.'
          : err.error?.message ?? 'No se pudo actualizar el evento. Verifica los datos e intenta de nuevo.';
      }
    });
  }

  volverAtras(): void {
    void this.router.navigate(['/menu-principal']);
  }

  // ============================================================
  // ELIMINAR EVENTO
  // ============================================================

  /** Mensaje del advisor de confirmación. */
  get mensajeEliminar(): string {
    const nombre = this.nombre.trim();

    return nombre
      ? `¿Seguro que quieres eliminar "${nombre}"? Esta acción no se puede deshacer.`
      : '¿Seguro que quieres eliminar este evento? Esta acción no se puede deshacer.';
  }

  abrirConfirmacionEliminar(): void {
    this.error = '';
    this.confirmandoEliminar = true;
  }

  cancelarEliminar(): void {
    if (this.eliminando) {
      return;
    }

    this.confirmandoEliminar = false;
  }

  eliminarEvento(): void {

    if (this.eliminando || this.idEvento === null) {
      return;
    }

    this.eliminando = true;

    // DELETE /api/evento/{id}
    this.eventosService.eliminarEvento(this.idEvento).subscribe({
      next: () => {
        this.eliminando = false;
        this.confirmandoEliminar = false;
        void this.router.navigate(['/menu-principal']);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.eliminando = false;
        this.confirmandoEliminar = false;
        this.error = err.status === 401
          ? 'Tu sesión expiró. Inicia sesión nuevamente para eliminar el evento.'
          : err.error?.message ?? 'No se pudo eliminar el evento. Intenta de nuevo.';
      }
    });
  }
}
