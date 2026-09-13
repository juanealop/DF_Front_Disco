import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth/auth.service';
import { SedesService } from '../../../../core/services/sedes/sedes.service';
import { Evento } from '../../../../core/models/evento.model';
import { Sede } from '../../../../core/models/sede.model';

/** Opción del menú desplegable. */
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
export class MenuPrincipalComponent implements OnInit {

  // ============================================================
  // DATOS DE LA PANTALLA
  // ============================================================

  /**
   * Nombre de la discoteca autenticada.
   *
   * Este valor posteriormente también debería venir
   * del usuario/discoteca autenticado.
   */
  nombreDiscoteca = '';

  /**
   * Sedes.
   *
   * IMPORTANTE:
   * No hay datos quemados.
   * Estas listas se llenarán desde el backend.
   */
  sedes: Sede[] = [];

  /**
   * Eventos.
   *
   * IMPORTANTE:
   * No hay datos quemados.
   * Estos datos se llenarán desde el backend.
   */
  eventos: Evento[] = [];

  // ============================================================
  // MENÚ
  // ============================================================

  menuAbierto = false;

  readonly opcionesMenu: OpcionMenu[] = [
    {
      label: 'Cuenta',
      accion: 'cuenta'
    },
    {
      label: 'Facturación',
      accion: 'facturacion'
    },
    {
      label: 'Salir de la cuenta',
      accion: 'salir'
    }
  ];

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly authService: AuthService,
    private readonly sedesService: SedesService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.nombreDiscoteca = this.authService.getNombreDiscoteca() ?? '';

    const idDiscoteca = this.authService.getUsuarioId();
    if (idDiscoteca === null) return;

    this.sedesService.obtenerPorDiscoteca(idDiscoteca).subscribe({
      next: (sedes) => this.sedes = sedes,
      error: (error: unknown) => console.error('No se pudieron cargar las sedes.', error)
    });
  }

  ubicacionSede(sede: Sede): string {
    return [sede.ciudad, sede.pais].filter(Boolean).join(', ');
  }

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
        // TODO: navegar a Cuenta
        break;

      case 'facturacion':
        // TODO: navegar a Facturación
        break;
    }
  }

  // ============================================================
  // ACCIONES
  // ============================================================

  agregarSede(): void {
    void this.router.navigate(['/sedes/crear']);
  }

  agregarEvento(): void {
    // TODO: navegar al formulario de creación de evento
  }

  // ============================================================
  // CERRAR MENÚ AL HACER CLICK FUERA
  // ============================================================

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {

    if (!this.menuAbierto) {
      return;
    }

    const target = event.target as Node | null;

    if (
      target &&
      !this.el.nativeElement.contains(target)
    ) {
      this.menuAbierto = false;
    }
  }

  // ============================================================
  // CERRAR MENÚ CON ESC
  // ============================================================

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.menuAbierto = false;
  }
}
