// Espejo de CrearEventoDTO del backend (com.DF.back.evento.dtos.CrearEventoDTO).
//
// Nota: el DTO del backend todavía no incluye idSede, pero la entidad Evento
// exige una sede (relación ManyToOne obligatoria). Por eso el front envía
// idSede; si el backend lo ignora (Spring Boot ignora campos desconocidos por
// defecto) no pasa nada, y cuando se agregue al record queda alineado.
export interface CrearEventoDTO {
  nombre: string;
  descripcion: string;
  direccion: string;
  ciudad: string;
  /** LocalDateTime ISO sin zona, ej. "2026-09-27T22:38:00". */
  fechaInicio: string | null;
  /** LocalDateTime ISO sin zona, ej. "2026-09-28T03:00:00". */
  fechaFin: string | null;
  idSede: number;
}
