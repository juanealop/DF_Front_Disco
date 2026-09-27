import { Sede } from './sede.model';
import { ImagenEvento } from './imagen-evento.model';

// Espejo de Evento del backend (com.DF.back.evento.entidades.Evento).
export interface Evento {
  idEvento: number;
  nombre: string;
  descripcion: string;
  /** LocalDateTime ISO sin zona, ej. "2026-09-27T22:38:00". */
  fechaInicio: string | null;
  fechaFin: string | null;
  /** Fechas programadas (LocalDateTime ISO sin zona). */
  eventoProgramado: string[];
  /** La calcula el backend a partir de fechaInicio/fechaFin. */
  activa: boolean | null;
  sede: Sede;
  imagenes: ImagenEvento[];
}
