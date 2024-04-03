import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

import { APP_PATHS } from "../../app.paths";
import {
  LoginFormComponent,
  LoginFormSubmited,
} from "../../features/login-form";
import { AuthenticationService } from "../../authentication";

@Component({
  standalone: true,
  imports: [LoginFormComponent],
  template: `<app-login-form
    [isLoading]="isLoading()"
    (formSubmited)="formSubmited($event)"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginContainerComponent {
  isLoading = signal(false);

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar
  ) {}

  protected formSubmited(form: LoginFormSubmited): void {
    this.isLoading.set(true);

    this.authenticationService.login(form.email, form.password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate([APP_PATHS.DASHBOARD]);
      },
      error: (response) => {
        this.snackbar.open(response.error.message);
        this.isLoading.set(false);
      },
    });
  }
}
