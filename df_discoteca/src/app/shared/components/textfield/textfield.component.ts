import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textfield',
  standalone: true,
  templateUrl: './textfield.component.html',
  styleUrl: './textfield.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextfieldComponent),
      multi: true
    }
  ]
})
export class TextfieldComponent implements ControlValueAccessor {

  @Input() type: string = 'text';

  @Input() label: string = '';

  @Input() placeholder: string = '';

  @Input() autocomplete: string = 'off';

  @Input() multiline = false;

  // ============================================================
  // VALIDACIÓN (se propagan al input nativo)
  // ============================================================

  @Input() required = false;

  @Input() pattern: string | null = null;

  @Input() maxlength: number | null = null;

  @Input() minlength: number | null = null;

  @Input() inputmode: string | null = null;

  // ============================================================
  // CONTROL VALUE ACCESSOR
  // ============================================================

  value: string = '';

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
}
