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
  programacionEvento: {
    nombre: string;
    descripcion: string;
    fechaInicioProgramacion: string;
    fechaFinProgramacion: string;
    frecuencia: 'DIARIA' | 'SEMANAL' | 'QUINCENAL' | 'MENSUAL';
    activa?: boolean | null;
  } | null;
  /** La calcula el backend a partir de fechaInicio/fechaFin. */
  activa: boolean | null;
  sede: Sede;
  imagenes: ImagenEvento[];
}
