import { Component, ChangeDetectionStrategy } from '@angular/core';
import { routerFade } from '@teaching-scheduling-system/core/ui/animations';

@Component({
  selector: 'tss-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routerFade],
})
export class MainViewComponent {}
