import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-textfield',
  standalone: true,
  imports: [],
  templateUrl: './textfield.component.html',
  styleUrl: './textfield.component.scss'
})
export class TextfieldComponent {

  @Input() type: string = 'text';
  @Input() placeholder: string = '';

}