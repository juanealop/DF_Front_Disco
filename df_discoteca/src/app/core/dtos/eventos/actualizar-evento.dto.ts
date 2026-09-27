// Espejo de ActualizarEventoDTO del backend (com.DF.back.evento.dtos.ActualizarEventoDTO).
export interface ActualizarEventoDTO {
  nombre: string;
  descripcion: string;
  /** LocalDateTime ISO sin zona. */
  fechaInicio: string | null;
  /** LocalDateTime ISO sin zona. */
  fechaFin: string | null;
  urls: string[];
  eventoProgramado: string[];
}
