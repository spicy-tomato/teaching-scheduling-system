import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiAccordionItemComponent } from '@taiga-ui/kit';
import { SidebarItem } from '@teaching-scheduling-system/core/data-access/models';
import { BreadcrumbItem } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AppShellState,
  selectBreadcrumbs,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { delay, filter, Observable, take, takeUntil, tap } from 'rxjs';
import { SidebarConstant } from './sidebar.constant';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'tss-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class SidebarComponent implements AfterViewInit {
  /** VIEW CHILD */
  @ViewChildren(TuiAccordionItemComponent)
  accordionItems!: QueryList<TuiAccordionItemComponent>;

  /** PUBLIC PROPERTIES */
  public readonly items = SidebarConstant.items;
  public form!: FormGroup;

  /** PRIVATE METHODS */
  private readonly breadcrumbs$: Observable<BreadcrumbItem[]>;

  /** CONSTRUCTOR */
  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly sidebarService: SidebarService,
    private readonly destroy$: TuiDestroyService,
    appShellStore: Store<AppShellState>
  ) {
    this.breadcrumbs$ = appShellStore
      .select(selectBreadcrumbs)
      .pipe(takeUntil(destroy$));
    this.initForm();
  }

  /** LIFECYCLE */
  public ngAfterViewInit(): void {
    this.breadcrumbs$
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

    this.breadcrumbs$
      .pipe(
        filter((bc) => !bc.find((x) => x.url.includes('calendar'))),
        delay(150),
        tap(() => {
          const calendarAccordionItems = this.accordionItems.first;
          if (calendarAccordionItems.open) {
            calendarAccordionItems.close();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.sidebarService.emit({
      name: 'calendar.create',
      value: ['calendar.study', 'calendar.exam'],
    });
  }

  public onClickItem(item: SidebarItem): void {
    if (item.subCheckboxes) {
      if (item.routerLink?.includes('calendar')) {
        void this.router.navigate(['/calendar']);
      }
    }
  }

  public onClickCheckbox(controlName: string, value: boolean): void {
    const name = controlName as
      | 'calendar.study'
      | 'calendar.exam'
      | `calendar.@${string}`;
    this.sidebarService.emit({ name, value });
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    /**
     * form value:
     *  {
     *    calendar: {
     *      exam: true;
     *      study: true;
     *    }
     *  }
     */
    this.form = this.fb.group(
      this.items.reduce<Record<string, unknown>>((acc, curr) => {
        if (curr.subCheckboxes && curr.controlName) {
          acc[curr.controlName] = this.fb.group(
            curr.subCheckboxes.reduce<Record<string, unknown>>(
              (accControl, currControl) => {
                accControl[currControl.controlName] = [true];
                return accControl;
              },
              {}
            )
          );
        }
        return acc;
      }, {})
    );
  }
}
