import { ConsultarPersonaDTO } from '../personas/consultar-persona.dto';

// Espejo de ConsultarEventoDTO del backend (com.DF.back.evento.dtos.ConsultarEventoDTO).
//
// OJO: se respetan los nombres EXACTOS que expone el record del backend,
// incluidos "Descripcion" (con mayúscula) y "fechaInicial"/"fehaFinal".
export interface ConsultarEventoDTO {
  idSede: number;
  nombre: string;
  Descripcion: string;
  fechaInicial: string | null;
  fehaFinal: string | null;
  programacionEvento: {
    nombre: string;
    descripcion: string;
    fechaInicioProgramacion: string;
    fechaFinProgramacion: string;
    frecuencia: 'DIARIA' | 'SEMANAL' | 'QUINCENAL' | 'MENSUAL';
    activa: boolean | null;
  } | null;
  activa: boolean | null;
  personas: ConsultarPersonaDTO[];
  urls: string[];
}
