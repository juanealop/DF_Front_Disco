import { Sede } from './sede.model';

// Espejo de Evento del backend (com.DF.back.evento.entidades.Evento).
export interface Evento {
  idEvento: number;
  nombre: string;
  descripcion: string;
  direccion: string;
  ciudad: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  sede: Sede;
}
