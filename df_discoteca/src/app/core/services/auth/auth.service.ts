import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { RoleSistema } from '../../models/role-sistema.model';
import { RespuestaAutenticacion } from '../../models/respuesta-autenticacion.model';
import { SolicitudLogin } from '../../dtos/auth/solicitud-login.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly loginUrl = `${environment.apiUrl}/api/auth/login`;
  private readonly tokenKey = 'token';
  private readonly platformId = inject(PLATFORM_ID);

  constructor(private readonly http: HttpClient) {}

  // POST /api/auth/login
  // El front de la discoteca siempre inicia sesión con el rol DISCOTECA.
  login(email: string, password: string): Observable<RespuestaAutenticacion> {

    const solicitud: SolicitudLogin = {
      email,
      password,
      role: RoleSistema.DISCOTECA
    };

    return this.http.post<RespuestaAutenticacion>(this.loginUrl, solicitud).pipe(
      tap(({ token }) => this.setToken(token))
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.tokenKey);
  }

  // ============================================================
  // ID DEL USUARIO AUTENTICADO
  // El backend incluye el claim "userId" en el JWT; para el rol
  // DISCOTECA equivale al id de la discoteca.
  // ============================================================

  getUsuarioId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = this.decodificarToken(token);
    const userId = payload?.['userId'];

    if (typeof userId === 'number') return userId;
    if (typeof userId === 'string' && userId.trim() !== '') return Number(userId);

    return null;
  }

  private decodificarToken(token: string): Record<string, unknown> | null {
    const partes = token.split('.');
    if (partes.length < 2) return null;

    try {
      const base64 = partes[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');

      return JSON.parse(atob(padded)) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  logout(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(this.tokenKey);
  }

  private setToken(token: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.tokenKey, token);
  }
}
