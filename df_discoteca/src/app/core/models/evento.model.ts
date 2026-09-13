import { Sede } from './sede.model';

/** Espejo del evento expuesto por el backend. */
export interface Evento {
  idEvento: number;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  sede: Sede;
}
