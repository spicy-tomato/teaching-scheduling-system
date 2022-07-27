import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiAccordionItemComponent } from '@taiga-ui/kit';
import { SidebarConstant } from '@teaching-scheduling-system/core/data-access/constants';
import {
  AppShellState,
  selectBreadcrumbs,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { delay, take, tap } from 'rxjs';

@Component({
  selector: 'tss-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements AfterViewInit {
  /** VIEW CHILD */
  @ViewChildren(TuiAccordionItemComponent)
  accordionItems!: QueryList<TuiAccordionItemComponent>;

  /** PUBLIC PROPERTIES */
  public readonly items = SidebarConstant.items;

  /** CONSTRUCTOR */
  constructor(private readonly appShellStore: Store<AppShellState>) {}

  /** LIFECYCLE */
  public ngAfterViewInit(): void {
    this.appShellStore
      .select(selectBreadcrumbs)
      .pipe(
        delay(2000),
        tap((breadcrumbs) => {
          const itemNeedOpen = this.accordionItems.find(
            (x) => !!breadcrumbs?.find((b) => b.label.includes(x.nativeId))
          );
          // Have to call to close() first
          itemNeedOpen?.close();
          itemNeedOpen?.onRowToggle();
        }),
        take(1)
      )
      .subscribe();
  }
}
