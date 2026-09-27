import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Evento } from '../../models/evento.model';
import { CrearEventoDTO } from '../../dtos/eventos/crear-evento.dto';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  // Nota: ajustar la ruta base si el controlador de eventos usa otra
  // (por ahora se asume POST /api/eventos, igual que /api/sedes).
  private readonly eventosUrl = `${environment.apiUrl}/api/eventos`;

  constructor(private readonly http: HttpClient) {}

  // POST /api/eventos
  crearEvento(dto: CrearEventoDTO): Observable<Evento> {
    return this.http.post<Evento>(this.eventosUrl, dto);
  }

  // GET /api/eventos/{id}
  obtenerEvento(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.eventosUrl}/${id}`);
  }

  // GET /api/eventos/sede/{idSede}
  obtenerPorSede(idSede: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.eventosUrl}/sede/${idSede}`);
  }
}
