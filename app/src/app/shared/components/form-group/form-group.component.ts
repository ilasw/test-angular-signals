import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Message} from "primeng/message";

@Component({
  selector: 'app-form-group',
  imports: [
    Message
  ],
  templateUrl: './form-group.component.html',
  styleUrl: './form-group.component.css'
})
export class FormGroupComponent {
  @Input() label!: string;
  @Input() helper!: string;
  @Input() name!: string;
  @Input() control?: FormControl;
  protected readonly Object = Object;
}
