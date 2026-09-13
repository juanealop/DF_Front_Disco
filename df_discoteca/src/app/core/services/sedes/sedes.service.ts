import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Sede } from '../../models/sede.model';
import { CrearSedeDTO } from '../../dtos/sedes/crear-sede.dto';

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
}
