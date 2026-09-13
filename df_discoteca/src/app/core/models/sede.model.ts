import { ImagenSede } from './imagen-sede.model';

// Espejo de Sedes del backend (com.DF.back.sedes.entidades.Sedes).
export interface Sede {
  idSede: number;
  nombre: string;
  descripcion: string;
  direccion: string;
  ciudad: string;
  pais: string;
  idDiscoteca: number;
  imagenes: ImagenSede[];
}
