import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  template: ` hello `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardContainerComponent {}
