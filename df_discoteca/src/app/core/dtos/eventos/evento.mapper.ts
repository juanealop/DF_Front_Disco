import { Evento } from '../../models/evento.model';
import { Sede } from '../../models/sede.model';
import { CrearEventoDTO } from './crear-evento.dto';

export class EventoMapper {

  /** Construye un Evento (modelo de front) a partir del DTO + su sede. */
  static toEntity(dto: CrearEventoDTO, sede: Sede): Evento {
    return {
      idEvento: 0,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      direccion: dto.direccion,
      ciudad: dto.ciudad,
      fechaInicio: dto.fechaInicio,
      fechaFin: dto.fechaFin,
      sede
    };
  }
}
