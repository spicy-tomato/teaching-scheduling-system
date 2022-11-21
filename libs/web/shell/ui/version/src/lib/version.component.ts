import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { VERSION_TOKEN } from '@teaching-scheduling-system/core/utils/providers';

@Component({
  selector: 'tss-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionComponent {
  // CONSTRUCTOR
  constructor(@Inject(VERSION_TOKEN) public readonly version: string) {}
}
