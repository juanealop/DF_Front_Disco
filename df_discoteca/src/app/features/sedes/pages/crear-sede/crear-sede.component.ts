import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { from, of, switchMap } from 'rxjs';

import { AuthService } from '../../../../core/services/auth/auth.service';
import { SedesService } from '../../../../core/services/sedes/sedes.service';
import { CrearSedeDTO } from '../../../../core/dtos/sedes/crear-sede.dto';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { TextfieldComponent } from '../../../../shared/components/textfield/textfield.component';

@Component({
  selector: 'app-crear-sede',
  standalone: true,
  imports: [FormsModule, ButtonComponent, TextfieldComponent],
  templateUrl: './crear-sede.component.html',
  styleUrl: './crear-sede.component.scss'
})
export class CrearSedeComponent {

  /** Máximo de imágenes que se pueden subir (según la maqueta). */
  readonly maxImagenes = 8;

  // ============================================================
  // DATOS DEL FORMULARIO
  // ============================================================

  nombre = '';
  descripcion = '';
  pais = '';
  ciudad = '';
  direccion = '';

  /** Imágenes seleccionadas (por ahora solo se manejan en el front). */
  imagenes: { nombre: string; url: string; archivo: File }[] = [];

  // ============================================================
  // ESTADO
  // ============================================================

  cargando = false;
  error = '';

  constructor(
    private readonly router: Router,
    private readonly sedesService: SedesService,
    private readonly authService: AuthService
  ) {}

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
  // CREAR SEDE
  // ============================================================

  crearSede(): void {

    if (this.cargando) {
      return;
    }

    this.cargando = true;
    this.error = '';

    const dto: CrearSedeDTO = {
      nombre: this.nombre.trim(),
      descripcion: this.descripcion.trim(),
      direccion: this.direccion.trim(),
      ciudad: this.ciudad.trim(),
      pais: this.pais.trim(),
      idDiscoteca: this.authService.getUsuarioId() ?? 0
    };

    from(this.convertirImagenesADataUrl()).pipe(
      switchMap((urls) => this.sedesService.crearSede(dto).pipe(
        switchMap((sede) => urls.length > 0
          ? this.sedesService.agregarImagenes(sede.idSede, urls)
          : of([]))
      ))
    ).subscribe({
      next: () => {
        this.cargando = false;
        void this.router.navigate(['/menu-principal']);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.cargando = false;
        this.error = err.status === 401
          ? 'Tu sesión expiró. Inicia sesión nuevamente para crear una sede.'
          : err.error?.message ?? 'No se pudo crear la sede. Verifica los datos e intenta de nuevo.';
      }
    });
  }

  volver(): void {
    void this.router.navigate(['/menu-principal']);
  }

  private convertirImagenesADataUrl(): Promise<string[]> {
    return Promise.all(
      this.imagenes.map(({ archivo }) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error(`No se pudo leer ${archivo.name}.`));
        reader.readAsDataURL(archivo);
      }))
    );
  }

}
