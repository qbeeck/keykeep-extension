import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonComponent } from './components/button/button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthenticationService } from './authentication';
import { AsyncPipe, NgIf } from '@angular/common';
import { APP_PATHS } from './app.paths';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    RouterOutlet,
    MatToolbarModule,
    ReactiveFormsModule,
    ButtonComponent,
  ],
  template: `
    <mat-toolbar color="primary">
      <app-button
        icon="home"
        color="accent"
        (clicked)="navigateToApplication()"
      >
        Home
      </app-button>

      <ng-container *ngIf="auth.isAuthorized | async as isAuthorized">
        <app-button
          *ngIf="isAuthorized"
          icon="logout"
          color="accent"
          (clicked)="auth.logout()"
        >
          Logout
        </app-button>
      </ng-container>
    </mat-toolbar>

    <main style="width: 300px; height: 300px">
      <router-outlet />
    </main>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly auth = inject(AuthenticationService);
  private readonly router = inject(Router);

  protected navigateToApplication(): void {
    window.open('http://localhost:4200/', '_blank');
  }

  constructor() {}
}
