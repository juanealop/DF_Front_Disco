// Espejo de CrearEventoDTO del backend (com.DF.back.evento.dtos.CrearEventoDTO).
export interface CrearEventoDTO {
  nombre: string;
  descripcion: string;
  /** LocalDateTime ISO sin zona, ej. "2026-09-27T22:38:00". */
  fechaInicio: string | null;
  /** LocalDateTime ISO sin zona, ej. "2026-09-28T03:00:00". */
  fechaFin: string | null;
  idSede: number;
  /** URLs de las imágenes del evento. */
  urls: string[];
  programacionEvento: {
    nombre: string;
    descripcion: string;
    fechaInicioProgramacion: string;
    fechaFinProgramacion: string;
    frecuencia: 'DIARIA' | 'SEMANAL' | 'QUINCENAL' | 'MENSUAL';
    activa?: boolean | null;
  } | null;
}
