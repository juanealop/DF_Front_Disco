import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth/auth.service';

/** Sede (local) de la discoteca. */
export interface Sede {
  nombre: string;
  ubicacion: string;
}

/** Evento programado en la discoteca. */
export interface Evento {
  nombre: string;
  sede: string;
  /** true => evento activo (línea verde), false => inactivo (línea roja). */
  activo: boolean;
}

/** Opción del desplegable del botón de menú. */
export interface OpcionMenu {
  label: string;
  accion: 'cuenta' | 'facturacion' | 'salir';
}

@Component({
  selector: 'app-menu-principal',
  standalone: true,
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.scss'
})
export class MenuPrincipalComponent {

  // ============================================================
  // PANTALLA PRINCIPAL DESPUÉS DE INICIAR SESIÓN COMO DISCOTECA
  // ============================================================

  /** Nombre de la discoteca autenticada (placeholder por ahora). */
  readonly nombreDiscoteca = 'NOMBRE DISCOTECA';

  /** Estado del desplegable que abre el botón de menú. */
  menuAbierto = false;

  /** Opciones que muestra el desplegable del botón. */
  readonly opcionesMenu: OpcionMenu[] = [
    { label: 'Cuenta', accion: 'cuenta' },
    { label: 'Facturación', accion: 'facturacion' },
    { label: 'Salir de la cuenta', accion: 'salir' }
  ];

  /** Sedes de la discoteca. */
  readonly sedes: Sede[] = [
    { nombre: 'Cantina 116', ubicacion: 'Bogotá, Colombia' },
    { nombre: 'Cantina Chía', ubicacion: 'Chía, Colombia' },
    { nombre: 'Cantina Valledupar', ubicacion: 'Valledupar, Colombia' }
  ];

  /** Eventos programados. */
  readonly eventos: Evento[] = [
    { nombre: 'Viernes Cantina', sede: 'Cantina 116', activo: true },
    { nombre: 'Sábado Cantina', sede: 'Cantina 116', activo: false }
  ];

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  // ============================================================
  // DESPLEGABLE
  // ============================================================

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  seleccionarOpcion(opcion: OpcionMenu): void {
    this.menuAbierto = false;

    switch (opcion.accion) {

      case 'salir':
        this.authService.logout();
        void this.router.navigate(['/']);
        break;

      case 'cuenta':
      case 'facturacion':
        // TODO: navegar a las pantallas de Cuenta / Facturación.
        break;

    }
  }

  // ============================================================
  // ACCIONES DE LAS SECCIONES
  // ============================================================

  agregarSede(): void {
    // TODO: abrir el formulario/modal para crear una sede.
  }

  agregarEvento(): void {
    // TODO: abrir el formulario/modal para crear un evento.
  }

  // ============================================================
  // CERRAR AL HACER CLIC FUERA / ESC
  // ============================================================

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.menuAbierto) {
      return;
    }

    const target = event.target as Node | null;

    if (target && !this.el.nativeElement.contains(target)) {
      this.menuAbierto = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.menuAbierto = false;
  }

}
