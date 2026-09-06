import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { RoleSistema } from '../../models/role-sistema.model';
import { RespuestaAutenticacion } from '../../models/respuesta-autenticacion.model';
import { SolicitudLogin } from '../../dtos/auth/solicitud-login.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly loginUrl = `${environment.apiUrl}/api/auth/login`;

  constructor(private readonly http: HttpClient) {}

  // POST /api/auth/login
  // El front de la discoteca siempre inicia sesión con el rol DISCOTECA.
  login(email: string, password: string): Observable<RespuestaAutenticacion> {

    const solicitud: SolicitudLogin = {
      email,
      password,
      role: RoleSistema.DISCOTECA
    };

    return this.http.post<RespuestaAutenticacion>(this.loginUrl, solicitud);
  }
}
