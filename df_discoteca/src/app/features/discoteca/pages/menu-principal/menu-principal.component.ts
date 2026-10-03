import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

import { AuthService } from '../../../../core/services/auth/auth.service';
import { SedesService } from '../../../../core/services/sedes/sedes.service';
import { EventosService } from '../../../../core/services/eventos/eventos.service';
import { ConsultarEventoDTO } from '../../../../core/dtos/eventos/consultar-evento.dto';
import { Sede } from '../../../../core/models/sede.model';

/** Opción del menú desplegable. */
export interface OpcionMenu {
  label: string;
  accion: 'cuenta' | 'facturacion' | 'salir';
}

/**
 * Evento ya listo para pintar en el panel de Eventos.
 *
 * El ConsultarEventoDTO del backend NO trae idEvento ni el objeto sede
 * (solo idSede), así que aquí se agrega el nombre de la sede y una clave
 * estable para el @for.
 */
export interface EventoVista {
  key: string;
  idEvento: number | null;
  idSede: number;
  nombreSede: string;
  descripcion: string;
  fechaInicial: string | null;
  activa: boolean;
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
   * Eventos de todas las sedes de la discoteca.
   *
   * IMPORTANTE:
   * No hay datos quemados: se cargan desde
   * GET /api/evento/sede/{idSede} para cada sede.
   */
  eventos: EventoVista[] = [];

  /** True mientras se están trayendo los eventos del backend. */
  cargandoEventos = false;

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
    private readonly eventosService: EventosService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.nombreDiscoteca = this.authService.getNombreDiscoteca() ?? '';

    const idDiscoteca = this.authService.getUsuarioId();
    if (idDiscoteca === null) return;

    this.sedesService.obtenerPorDiscoteca(idDiscoteca).subscribe({
      next: (sedes) => {
        this.sedes = sedes;
        this.cargarEventos(sedes);
      },
      error: (error: unknown) => {
        console.error('No se pudieron cargar las sedes.', error);
        this.cargandoEventos = false;
      }
    });
  }

  ubicacionSede(sede: Sede): string {
    return [sede.ciudad, sede.pais].filter(Boolean).join(', ');
  }

  // ============================================================
  // EVENTOS (GET /api/evento/sede/{idSede})
  // ============================================================

  /**
   * Trae los eventos de cada sede en paralelo y arma la lista del panel.
   * Se consumen con forkJoin para no hacer N requests en cascada.
   */
  private cargarEventos(sedes: Sede[]): void {
    if (!sedes.length) {
      this.eventos = [];
      this.cargandoEventos = false;
      return;
    }

    this.cargandoEventos = true;

    forkJoin(
      sedes.map((sede) =>
        this.eventosService.obtenerEventosPorSede(sede.idSede).pipe(
          // Si una sede falla, no tumbamos las demás.
          catchError((error: unknown) => {
            console.error(
              `No se pudieron cargar los eventos de la sede ${sede.idSede}.`,
              error
            );
            return of([] as ConsultarEventoDTO[]);
          })
        )
      )
    ).subscribe({
      next: (listas) => {
        this.eventos = listas.flatMap((lista, i) =>
          lista.map((dto, j) => this.aVista(dto, sedes[i], j))
        );

        // Activos primero.
        this.eventos.sort((a, b) => Number(b.activa) - Number(a.activa));
        this.cargandoEventos = false;
      },
      error: (error: unknown) => {
        console.error('No se pudieron cargar los eventos.', error);
        this.cargandoEventos = false;
      }
    });
  }

  /** Adapta el ConsultarEventoDTO del backend a la vista del panel. */
  private aVista(
    dto: ConsultarEventoDTO,
    sede: Sede,
    indice: number
  ): EventoVista {
    return {
      key: `${dto.idSede}-${indice}-${dto.fechaInicial ?? ''}`,
      idEvento: dto.idEvento ?? null,
      idSede: dto.idSede,
      nombreSede: sede.nombre,
      // OJO: el backend expone "Descripcion" con mayúscula.
      descripcion: dto.Descripcion || dto.nombre,
      fechaInicial: dto.fechaInicial,
      activa: dto.activa === true
    };
  }

  /** Formatea la fecha ISO del backend como dd/mm/aaaa hh:mm. */
  fechaTexto(fecha: string | null): string {
    if (!fecha) return 'Sin fecha';

    const d = new Date(fecha);
    if (Number.isNaN(d.getTime())) return fecha;

    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');

    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
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

  verSede(sede: Sede): void {
    void this.router.navigate(['/sedes', sede.idSede], { state: { sede } });
  }

  agregarEvento(): void {
    void this.router.navigate(['/eventos/crear']);
  }

  /** Abre la pantalla de edición del evento (requiere el idEvento). */
  verEvento(evento: EventoVista): void {
    if (evento.idEvento === null) {
      console.warn(
        'El evento no trae idEvento; el backend debe incluirlo en ConsultarEventoDTO para poder editarlo.'
      );
      return;
    }

    void this.router.navigate(['/eventos', evento.idEvento]);
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
