import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Tipos de campo de fecha/hora soportados. */
export type TipoCampoFecha = 'date' | 'time' | 'datetime-local';

/**
 * Campo reutilizable de fecha y hora.
 * Reutiliza el mismo look & feel del `textfield` y toma los colores de
 * `styles/_variable.scss`, pero oculta el ícono nativo del navegador
 * (que se desbordaba) y pinta uno propio.
 */
@Component({
  selector: 'app-datefield',
  standalone: true,
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

  @Input() required = false;

  @Input() min: string | null = null;

  @Input() max: string | null = null;

  // ============================================================
  // CONTROL VALUE ACCESSOR
  // ============================================================

  value = '';

  disabled = false;

  private onChange: (value: string) => void = () => {};

  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value = value ?? '';
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

  // ============================================================
  // EVENTOS
  // ============================================================

  onInput(value: string): void {
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  /** Abre el selector nativo (calendario / reloj) al pulsar el ícono. */
  abrirSelector(input: HTMLInputElement): void {
    const campo = input as HTMLInputElement & { showPicker?: () => void };

    if (typeof campo.showPicker === 'function') {
      try {
        campo.showPicker();
        return;
      } catch {
        // Algunos navegadores lo bloquean si no viene de una acción del usuario.
      }
    }

    input.focus();
  }
}
