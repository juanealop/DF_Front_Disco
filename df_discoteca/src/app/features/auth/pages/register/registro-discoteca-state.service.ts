import { Injectable } from '@angular/core';

export interface InfoRegistroDiscoteca {
  nombre: string;
  descripcion: string;
  telefono: string;
  email: string;
  direccion: string;
  contrasena: string;
  pais: string;
  ciudad: string;
}

// Comparte entre el paso 1 (información) y el paso 2 (pago)
// los datos de la discoteca que se está registrando.
@Injectable({
  providedIn: 'root'
})
export class RegistroDiscotecaStateService {

  info: InfoRegistroDiscoteca | null = null;

  guardarInfo(info: InfoRegistroDiscoteca): void {
    this.info = info;
  }

  limpiar(): void {
    this.info = null;
  }
}
