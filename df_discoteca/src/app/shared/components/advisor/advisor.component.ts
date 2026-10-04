import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonComponent } from '../button/button.component';

/**
 * Advisor.
 *
 * Tarjeta reutilizable de aviso/confirmación con un título, un mensaje y
 * dos botones (secundario y primario). Reutiliza el componente app-button
 * y toma los colores de styles/_variable.scss.
 *
 * Uso:
 *   <app-advisor
 *     titulo="Eliminar evento"
 *     mensaje="¿Seguro que quieres eliminarlo?"
 *     textoPrimario="Eliminar"
 *     textoSecundario="Cancelar"
 *     (primario)="eliminar()"
 *     (secundario)="cerrar()"
 *   />
 */
@Component({
  selector: 'app-advisor',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './advisor.component.html',
  styleUrl: './advisor.component.scss'
})
export class AdvisorComponent {

  /** Título del advisor. */
  @Input() titulo = '';

  /** Mensaje que aparece debajo del título (admite saltos de línea). */
  @Input() mensaje = '';

  /** Texto del botón primario (relleno). */
  @Input() textoPrimario = 'Aceptar';

  /** Texto del botón secundario (contorno). */
  @Input() textoSecundario = 'Cancelar';

  /** Muestra el spinner en el botón primario. */
  @Input() cargando = false;

  /** Se emite al pulsar el botón primario. */
  @Output() readonly primario = new EventEmitter<void>();

  /** Se emite al pulsar el botón secundario. */
  @Output() readonly secundario = new EventEmitter<void>();
}
