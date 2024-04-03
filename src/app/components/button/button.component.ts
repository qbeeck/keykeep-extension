import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

type BehaviorType = 'button' | 'raised' | 'flat' | 'stroked';
type Type = 'button' | 'submit';
type Color = 'primary' | 'accent' | 'warn';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinner,
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly isLoading = input(false);
  readonly behaviorType = input<BehaviorType>('raised');
  readonly type = input<Type>('button');
  readonly color = input<Color>('primary');
  readonly disabled = input(false);
  readonly icon = input('');

  @Output() readonly clicked = new EventEmitter<void>();
}
