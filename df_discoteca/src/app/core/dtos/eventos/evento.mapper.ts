import { Evento } from '../../models/evento.model';
import { Sede } from '../../models/sede.model';
import { ImagenEvento } from '../../models/imagen-evento.model';
import { CrearEventoDTO } from './crear-evento.dto';

export class EventoMapper {

  /**
   * CrearEventoDTO -> Evento (modelo de front).
   * Espejo de MapperEvento.crearEventoDTOAEntidad del backend: solo se
   * mapean nombre, descripcion, fechas, eventoProgramado, sede e imágenes.
   */
  static toEntity(dto: CrearEventoDTO, sede: Sede): Evento {
    const imagenes: ImagenEvento[] = (dto.urls ?? []).map((url, index) => ({
      idImagen: index,
      url
    }));

    return {
      idEvento: 0,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      fechaInicio: dto.fechaInicio,
      fechaFin: dto.fechaFin,
      eventoProgramado: dto.eventoProgramado ?? [],
      activa: null,
      sede,
      imagenes
    };
  }
}
