import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {}
