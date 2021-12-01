import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BreadcrumbItem } from '@models/main-view/breadcrumb-item.model';

@Component({
  selector: 'tss-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  /** INPUT */
  @Input() public breadcrumbs!: BreadcrumbItem[];
}
