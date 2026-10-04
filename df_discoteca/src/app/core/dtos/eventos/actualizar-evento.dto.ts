// Espejo de ActualizarEventoDTO del backend (com.DF.back.evento.dtos.ActualizarEventoDTO).
export interface ActualizarEventoDTO {
  nombre: string;
  descripcion: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  urls: string[];
}
