import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from "@angular/core";
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  MatCardHeader,
  MatCard,
  MatCardContent,
  MatCardTitle,
} from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { LoginFormSubmited } from "./interfaces";
import { NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";

import { ButtonComponent } from "../../components/button";

@Component({
  selector: "app-login-form",
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    RouterLink,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatInputModule,
    ButtonComponent,
  ],
  templateUrl: "./login-form.component.html",
  styleUrl: "./login-form.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  readonly isLoading = input(false);

  @Output() readonly formSubmited = new EventEmitter<LoginFormSubmited>();

  protected readonly form = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  });

  constructor(private readonly formBuilder: NonNullableFormBuilder) {}

  protected submited(): void {
    if (this.form.invalid) return;

    this.formSubmited.emit({
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
    });
  }
}
