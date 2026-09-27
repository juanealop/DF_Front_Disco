import {
  Component,
  ElementRef,
  HostListener,
  Input,
  forwardRef,
  inject
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Tipos de campo de fecha/hora soportados. */
export type TipoCampoFecha = 'date' | 'time' | 'datetime-local';

/** Celda del calendario. */
export interface DiaCalendario {
  fecha: Date;
  numero: number;
  delMes: boolean;
  hoy: boolean;
}

/**
 * Campo reutilizable de fecha y hora con selector propio.
 *
 * Flujo: primero se elige la FECHA en el calendario y, recién entonces,
 * aparece la parte de HORA (Horas / Minutos / a.m.-p.m.) para que no se
 * vea todo aglomerado.
 *
 * Toma los colores de `styles/_variable.scss`.
 */
@Component({
  selector: 'app-datefield',
  standalone: true,
  imports: [],
  templateUrl: './datefield.component.html',
  styleUrl: './datefield.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatefieldComponent),
      multi: true
    }
  ]
})
export class DatefieldComponent implements ControlValueAccessor {

  /** 'date' (solo fecha) | 'time' (solo hora) | 'datetime-local' (fecha y hora). */
  @Input() type: TipoCampoFecha = 'datetime-local';

  @Input() label = '';

  @Input() placeholder = '';

  @Input() required = false;

  // ============================================================
  // CONSTANTES DE UI
  // ============================================================

  readonly diasSemana = ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'];

  readonly meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  readonly horas: number[] = Array.from({ length: 12 }, (_, i) => i + 1);

  readonly minutos: number[] = Array.from({ length: 60 }, (_, i) => i);

  readonly periodos: Array<'a.m.' | 'p.m.'> = ['a.m.', 'p.m.'];

  // ============================================================
  // ESTADO
  // ============================================================

  abierto = false;

  disabled = false;

  /** Valor del modelo (formato ISO del input nativo). */
  value = '';

  /** Mes/año visibles en el calendario. */
  mesVisible = new Date().getMonth();

  anioVisible = new Date().getFullYear();

  /** Parte de fecha seleccionada. */
  fecha: Date | null = null;

  /** Parte de hora seleccionada. */
  hora12 = 12;

  minuto = 0;

  periodo: 'a.m.' | 'p.m.' = 'a.m.';

  private onChange: (value: string) => void = () => {};

  private onTouched: () => void = () => {};

  private readonly el = inject(ElementRef<HTMLElement>);

  // ============================================================
  // GETTERS DE UI
  // ============================================================

  get dias(): DiaCalendario[] {
    const primero = new Date(this.anioVisible, this.mesVisible, 1);
    const inicio = new Date(this.anioVisible, this.mesVisible, 1 - primero.getDay());

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const dias: DiaCalendario[] = [];

    for (let i = 0; i < 42; i++) {
      const fecha = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i);

      dias.push({
        fecha,
        numero: fecha.getDate(),
        delMes: fecha.getMonth() === this.mesVisible,
        hoy: fecha.getTime() === hoy.getTime()
      });
    }

    return dias;
  }

  get tituloMes(): string {
    return `${this.meses[this.mesVisible]} ${this.anioVisible}`;
  }

  /** ¿Ya se eligió la fecha? -> habilita la parte de hora. */
  get hayFecha(): boolean {
    return this.fecha !== null;
  }

  /**
   * La hora se muestra cuando el campo la incluye:
   * - 'time' siempre,
   * - 'datetime-local' únicamente después de elegir la fecha.
   */
  get muestraHora(): boolean {
    if (this.type === 'date') {
      return false;
    }
    return this.type === 'time' || this.hayFecha;
  }

  get textoMostrado(): string {
    const partes: string[] = [];

    if (this.type !== 'time' && this.fecha) {
      partes.push(this.formatearFecha(this.fecha));
    }

    if (this.type !== 'date' && (this.type === 'time' || this.fecha)) {
      partes.push(`${this.pad(this.hora12)}:${this.pad(this.minuto)} ${this.periodo}`);
    }

    return partes.join(' ');
  }

  get textoPlaceholder(): string {
    if (this.placeholder) {
      return this.placeholder;
    }

    if (this.type === 'date') {
      return 'dd/mm/aaaa';
    }

    if (this.type === 'time') {
      return 'hh:mm a.m. / p.m.';
    }

    return 'dd/mm/aaaa hh:mm a.m. / p.m.';
  }

  // ============================================================
  // CALENDARIO
  // ============================================================

  esSeleccionado(dia: DiaCalendario): boolean {
    return !!this.fecha && this.mismaFecha(dia.fecha, this.fecha);
  }

  seleccionarDia(dia: DiaCalendario): void {
    this.fecha = dia.fecha;
    this.mesVisible = dia.fecha.getMonth();
    this.anioVisible = dia.fecha.getFullYear();
    this.emitir();
  }

  mesSiguiente(): void {
    this.moverMes(1);
  }

  mesAnterior(): void {
    this.moverMes(-1);
  }

  private moverMes(delta: number): void {
    const fecha = new Date(this.anioVisible, this.mesVisible + delta, 1);
    this.mesVisible = fecha.getMonth();
    this.anioVisible = fecha.getFullYear();
  }

  // ============================================================
  // HORA
  // ============================================================

  seleccionarHora(hora: number): void {
    this.hora12 = hora;
    this.emitir();
  }

  seleccionarMinuto(minuto: number): void {
    this.minuto = minuto;
    this.emitir();
  }

  seleccionarPeriodo(periodo: 'a.m.' | 'p.m.'): void {
    this.periodo = periodo;
    this.emitir();
  }

  // ============================================================
  // ACCIONES
  // ============================================================

  alternarPanel(): void {
    if (this.disabled) {
      return;
    }
    this.abierto = !this.abierto;
  }

  usarHoy(): void {
    const ahora = new Date();

    this.fecha = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    this.mesVisible = ahora.getMonth();
    this.anioVisible = ahora.getFullYear();

    const h24 = ahora.getHours();
    this.periodo = h24 >= 12 ? 'p.m.' : 'a.m.';
    this.hora12 = h24 % 12 === 0 ? 12 : h24 % 12;
    this.minuto = ahora.getMinutes();

    this.emitir();
  }

  borrar(): void {
    this.fecha = null;
    this.hora12 = 12;
    this.minuto = 0;
    this.periodo = 'a.m.';
    this.emitir();
  }

  // ============================================================
  // CONTROL VALUE ACCESSOR
  // ============================================================

  writeValue(value: string | null): void {
    this.value = value ?? '';
    this.desdeValor(this.value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onBlur(): void {
    this.onTouched();
  }

  // ============================================================
  // HELPERS
  // ============================================================

  pad(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }

  private emitir(): void {
    const valor = this.aValor();
    this.value = valor;
    this.onChange(valor);
  }

  private aValor(): string {
    const fecha = this.fecha ? this.formatearFechaISO(this.fecha) : '';

    if (this.type === 'date') {
      return fecha;
    }

    const hora = `${this.pad(this.hora24)}:${this.pad(this.minuto)}`;

    if (this.type === 'time') {
      return hora;
    }

    return fecha ? `${fecha}T${hora}` : '';
  }

  private desdeValor(valor: string): void {
    if (!valor) {
      return;
    }

    const [parteFecha, parteHora] = valor.split('T');

    if (this.type !== 'time' && parteFecha) {
      const [y, m, d] = parteFecha.split('-').map(Number);

      if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
        this.fecha = new Date(y, m - 1, d);
        this.mesVisible = m - 1;
        this.anioVisible = y;
      }
    }

    const horaTexto = this.type === 'time' ? valor : parteHora;

    if (horaTexto) {
      const [h, min] = horaTexto.split(':').map(Number);

      if (!Number.isNaN(h)) {
        this.periodo = h >= 12 ? 'p.m.' : 'a.m.';
        this.hora12 = h % 12 === 0 ? 12 : h % 12;
      }

      if (!Number.isNaN(min)) {
        this.minuto = min;
      }
    }
  }

  private get hora24(): number {
    const h = this.hora12 % 12;
    return this.periodo === 'p.m.' ? h + 12 : h;
  }

  private formatearFecha(fecha: Date): string {
    return `${this.pad(fecha.getDate())}/${this.pad(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
  }

  private formatearFechaISO(fecha: Date): string {
    return `${fecha.getFullYear()}-${this.pad(fecha.getMonth() + 1)}-${this.pad(fecha.getDate())}`;
  }

  private mismaFecha(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  // ============================================================
  // CERRAR AL HACER CLICK FUERA / ESC
  // ============================================================

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.abierto) {
      return;
    }

    const target = event.target as Node | null;

    if (target && !this.el.nativeElement.contains(target)) {
      this.abierto = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.abierto = false;
  }
}
