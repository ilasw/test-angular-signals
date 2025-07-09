import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputText} from "primeng/inputtext";
import {Fieldset} from "primeng/fieldset";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Button} from "primeng/button";
import {MessageModule} from "primeng/message";
import {FormGroupComponent} from "../../../shared/components/form-group/form-group.component";

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    InputText,
    Fieldset,
    ReactiveFormsModule,
    Button,
    MessageModule,
    FormGroupComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  formBuilder = new FormBuilder();
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const formValue = this.loginForm.value;
    console.log('credentials:', formValue);
  }
}
