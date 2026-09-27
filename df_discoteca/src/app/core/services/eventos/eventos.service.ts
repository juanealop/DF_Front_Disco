import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Evento } from '../../models/evento.model';
import { CrearEventoDTO } from '../../dtos/eventos/crear-evento.dto';
import { ActualizarEventoDTO } from '../../dtos/eventos/actualizar-evento.dto';
import { ConsultarEventoDTO } from '../../dtos/eventos/consultar-evento.dto';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  // El controlador del backend es /api/evento (SINGULAR).
  private readonly eventosUrl = `${environment.apiUrl}/api/evento`;

  constructor(private readonly http: HttpClient) {}

  // POST /api/evento
  crearEvento(dto: CrearEventoDTO): Observable<Evento> {
    return this.http.post<Evento>(this.eventosUrl, dto);
  }

  // GET /api/evento/{id}
  // Devuelve el ConsultarEventoDTO del backend.
  obtenerEvento(id: number): Observable<ConsultarEventoDTO> {
    return this.http.get<ConsultarEventoDTO>(`${this.eventosUrl}/${id}`);
  }

  // GET /api/evento/{id}/personas/count
  contarPersonasRegistradas(id: number): Observable<number> {
    return this.http.get<number>(`${this.eventosUrl}/${id}/personas/count`);
  }

  // PUT /api/evento/{id}
  actualizarEvento(id: number, dto: ActualizarEventoDTO): Observable<Evento> {
    return this.http.put<Evento>(`${this.eventosUrl}/${id}`, dto);
  }

  // DELETE /api/evento/{id}
  eliminarEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.eventosUrl}/${id}`);
  }
}
