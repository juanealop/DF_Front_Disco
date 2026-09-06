import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Discoteca } from '../../models/discoteca.model';
import { CrearDiscotecaDTO } from '../../dtos/discoteca/discoteca-create.dto';

@Injectable({
  providedIn: 'root'
})
export class DiscotecaService {

  private readonly registroUrl = `${environment.apiUrl}/api/discoteca/registro`;

  constructor(private readonly http: HttpClient) {}

  // POST /api/discoteca/registro
  crearDiscoteca(dto: CrearDiscotecaDTO): Observable<Discoteca> {
    return this.http.post<Discoteca>(this.registroUrl, dto);
  }
}
