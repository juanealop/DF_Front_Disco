
import { Discoteca } from '../../models/discoteca.model';
import { CrearDiscotecaDTO } from "./discoteca-create.dto";

export class DiscotecaMapper {

  static toEntity(dto: CrearDiscotecaDTO): Discoteca {
    return {
      idDiscoteca: 0,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      direccion: dto.direccion,
      pais: dto.pais,
      ciudad: dto.ciudad,
      telefono: dto.telefono,
      email: dto.email,
      contrasena: dto.contrasena,
      precioPersona: 5000
    };
  }
}