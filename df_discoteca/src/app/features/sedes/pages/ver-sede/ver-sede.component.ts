import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, from, of, switchMap } from 'rxjs';

import { SedesService } from '../../../../core/services/sedes/sedes.service';
import { Sede } from '../../../../core/models/sede.model';
import { ActualizarSedeDTO } from '../../../../core/dtos/sedes/actualizar-sede.dto';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { TextfieldComponent } from '../../../../shared/components/textfield/textfield.component';

@Component({
  selector: 'app-ver-sede',
  standalone: true,
  imports: [FormsModule, ButtonComponent, TextfieldComponent],
  templateUrl: './ver-sede.component.html',
  styleUrl: './ver-sede.component.scss'
})
export class VerSedeComponent implements OnInit {

  /** Máximo de imágenes que se pueden manejar (según la maqueta). */
  readonly maxImagenes = 8;

  // ============================================================
  // DATOS DE LA SEDE
  // ============================================================

  sede: Sede | null = null;

  private idSede: number | null = null;

  // ============================================================
  // DATOS DEL FORMULARIO
  // ============================================================

  nombre = '';
  descripcion = '';
  pais = '';
  ciudad = '';
  direccion = '';

  /** Imágenes de la sede (+ las que se agreguen en el front). */
  imagenes: { idImagen?: number; nombre: string; url: string; archivo?: File }[] = [];
  private readonly imagenesEliminadas = new Set<number>();

  // ============================================================
  // ESTADO
  // ============================================================

  cargandoSede = false;
  cargando = false;
  error = ''; 
  imagenSeleccionada: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sedesService: SedesService
  ) {}

  // ============================================================
  // CARGA INICIAL
  // ============================================================

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.idSede = idParam !== null && idParam !== '' ? Number(idParam) : null;

    // Si venimos del menú principal, la sede llega por el estado de
    // navegación y evitamos un request extra.
    const sedeDesdeEstado = this.sedeDesdeEstado();

    if (
      sedeDesdeEstado &&
      (this.idSede === null || sedeDesdeEstado.idSede === this.idSede)
    ) {
      this.cargarSede(sedeDesdeEstado);
      return;
    }

    if (this.idSede === null || Number.isNaN(this.idSede)) {
      this.error = 'No se encontró la sede.';
      return;
    }

    this.cargandoSede = true;

    this.sedesService.obtenerSede(this.idSede).subscribe({
      next: (sede) => {
        this.cargandoSede = false;
        this.cargarSede(sede);
      },
      error: (err: unknown) => {
        console.error(err);
        this.cargandoSede = false;
        this.error = 'No se pudo cargar la sede.';
      }
    });
  }

  verImagen(url: string): void {
  this.imagenSeleccionada = url;
}

cerrarImagen(): void {
  this.imagenSeleccionada = null;
}

  private sedeDesdeEstado(): Sede | null {
    if (typeof window === 'undefined') return null;

    const state = window.history.state as { sede?: Sede } | null;

    return state?.sede ?? null;
  }

  private cargarSede(sede: Sede): void {
    this.sede = sede;

    this.nombre = sede.nombre ?? '';
    this.descripcion = sede.descripcion ?? '';
    this.pais = sede.pais ?? '';
    this.ciudad = sede.ciudad ?? '';
    this.direccion = sede.direccion ?? '';

    this.imagenes = (sede.imagenes ?? []).map((imagen) => ({
      idImagen: imagen.idImagen,
      nombre: '',
      url: imagen.url
    }));
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
        url: URL.createObjectURL(file),
        archivo: file
      });
    }

    input.value = '';
  }

  quitarImagen(index: number): void {
    const [imagen] = this.imagenes.splice(index, 1);

    if (imagen?.idImagen !== undefined) {
      this.imagenesEliminadas.add(imagen.idImagen);
    }

    if (imagen && imagen.url.startsWith('blob:')) {
      URL.revokeObjectURL(imagen.url);
    }
  }

  // ============================================================
  // ACTUALIZAR SEDE (PUT /api/sedes/{id})
  // ============================================================

  actualizarSede(): void {

  if (this.cargando || this.idSede === null) {
    return;
  }

  this.cargando = true;
  this.error = '';

  const dto: ActualizarSedeDTO = {
    nombre: this.nombre.trim(),
    descripcion: this.descripcion.trim(),
    direccion: this.direccion.trim(),
    ciudad: this.ciudad.trim(),
    pais: this.pais.trim()
  };

  from(this.convertirImagenesADataUrl()).pipe(
    switchMap((urls) => this.sedesService.actualizarSede(this.idSede!, dto).pipe(
      switchMap(() => this.eliminarYAgregarImagenes(urls))
    ))
  ).subscribe({
    next: () => {
      this.cargando = false;

      // Después de actualizar correctamente,
      // regresar al menú principal
      void this.router.navigate(['/menu-principal']);
    },
    error: (err: HttpErrorResponse) => {
      console.error(err);
      this.cargando = false;

      this.error = err.status === 401
        ? 'Tu sesión expiró. Inicia sesión nuevamente para actualizar la sede.'
        : err.error?.message ??
          'No se pudo actualizar la sede. Verifica los datos e intenta de nuevo.';
    }
  });
}

  // ============================================================
  // VOLVER ATRÁS
  // ============================================================

  volverAtras(): void {
    void this.router.navigate(['/menu-principal']);
  }

  private eliminarYAgregarImagenes(urls: string[]) {
    const eliminaciones = [...this.imagenesEliminadas].map((idImagen) =>
      this.sedesService.eliminarImagen(this.idSede!, idImagen)
    );

    const eliminar = eliminaciones.length > 0 ? forkJoin(eliminaciones) : of([]);

    return eliminar.pipe(
      switchMap(() => urls.length > 0
        ? this.sedesService.agregarImagenes(this.idSede!, urls)
        : of([]))
    );
  }

  private convertirImagenesADataUrl(): Promise<string[]> {
    return Promise.all(
      this.imagenes
        .filter((imagen) => imagen.archivo)
        .map(({ archivo }) => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error(`No se pudo leer ${archivo?.name}.`));
          reader.readAsDataURL(archivo!);
        }))
    );
  }

}
