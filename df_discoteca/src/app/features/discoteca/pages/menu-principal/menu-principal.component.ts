import { Component, ElementRef, HostListener } from '@angular/core';

/** Sede (local) de la discoteca. */
export interface Sede {
  nombre: string;
  ubicacion: string;
}

/** Evento programado en la discoteca. */
export interface Evento {
  nombre: string;
  sede: string;
}

/** Opción del desplegable del botón de menú. */
export interface OpcionMenu {
  label: string;
  accion: 'cuenta' | 'facturacion';
}

@Component({
  selector: 'app-menu-principal',
  imports: [],
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
    { label: 'Facturación', accion: 'facturacion' }
  ];

  /** Sedes de la discoteca. */
  readonly sedes: Sede[] = [
    { nombre: 'Cantina 116', ubicacion: 'Bogotá, Colombia' },
    { nombre: 'Cantina Chía', ubicacion: 'Chía, Colombia' },
    { nombre: 'Cantina Valledupar', ubicacion: 'Valledupar, Colombia' }
  ];

  /** Eventos programados. */
  readonly eventos: Evento[] = [
    { nombre: 'Viernes Cantina', sede: 'Cantina 116' },
    { nombre: 'Sábado Cantina', sede: 'Cantina 116' }
  ];

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  // ============================================================
  // DESPLEGABLE
  // ============================================================

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  seleccionarOpcion(opcion: OpcionMenu): void {
    this.menuAbierto = false;

    // TODO: aquí va la acción de cada opción (por ejemplo navegar a
    // las pantallas de Cuenta / Facturación cuando existan sus rutas).
    void opcion;
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
