import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputText} from "primeng/inputtext";
import {Fieldset} from "primeng/fieldset";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Button} from "primeng/button";
import {MessageModule} from "primeng/message";
import {FormGroupComponent} from "../../../shared/components/form-group/form-group.component";
import {FormStatus} from "../../../shared/types/form";
import {HttpClient} from "@angular/common/http";

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

  http = inject(HttpClient);

  formStatus = FormStatus.Initial;
  formBuilder = new FormBuilder();
  loginForm = this.formBuilder.group({
    email: ['admin@example.com', [Validators.required, Validators.email]],
    password: ['admin123', [Validators.required, Validators.minLength(8)]]
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.formStatus = FormStatus.Loading;
    const formValue = this.loginForm.value;
    console.log('credentials:', formValue);

    this.http.post('http://localhost:3030/auth/login', formValue).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.formStatus = FormStatus.Success;
        // Handle successful login, e.g., redirect to dashboard
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.formStatus = FormStatus.Error;
      }
    })
  }

  protected readonly FormStatus = FormStatus;
}
