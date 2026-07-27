import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() text = 'Botón';

  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Input() disabled = false;

  @Input() loading = false;

  @Output() clicked = new EventEmitter<void>();

  onClick(): void {

    if (this.disabled || this.loading) {
      return;
    }

    this.clicked.emit();

  }

}