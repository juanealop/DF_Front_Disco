// Espejo de ConsultarPersonaDTO del backend (com.DF.back.personas.dtos.ConsultarPersonaDTO).
export interface ConsultarPersonaDTO {
  idPersona: number;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  pais: string;
  telefono: string;
  fechaNacimiento: string | null;
  ciudad: string;
}
