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
  /** Fechas programadas (LocalDateTime ISO sin zona). */
  eventoProgramado: string[];
}
