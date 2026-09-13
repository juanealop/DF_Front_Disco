import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Sede } from '../../models/sede.model';
import { CrearSedeDTO } from '../../dtos/sedes/crear-sede.dto';
import { ActualizarSedeDTO } from '../../dtos/sedes/actualizar-sede.dto';

@Injectable({
  providedIn: 'root'
})
export class SedesService {

  // Nota: ajustar la ruta base si el controlador de sedes usa otra
  // (por ahora se asume POST /api/sedes, igual que /api/discoteca/registro).
  private readonly sedesUrl = `${environment.apiUrl}/api/sedes`;

  constructor(private readonly http: HttpClient) {}

  // POST /api/sedes
  crearSede(dto: CrearSedeDTO): Observable<Sede> {
    return this.http.post<Sede>(this.sedesUrl, dto);
  }

  obtenerPorDiscoteca(idDiscoteca: number): Observable<Sede[]> {
    return this.http.get<Sede[]>(`${this.sedesUrl}/discoteca/${idDiscoteca}`);
  }

  // GET /api/sedes/{id}
  // Devuelve el ConsultarSedeDTO del backend (misma forma que Sede).
  obtenerSede(id: number): Observable<Sede> {
    return this.http.get<Sede>(`${this.sedesUrl}/${id}`);
  }

  // PUT /api/sedes/{id}
  actualizarSede(id: number, dto: ActualizarSedeDTO): Observable<Sede> {
    return this.http.put<Sede>(`${this.sedesUrl}/${id}`, dto);
  }
}
