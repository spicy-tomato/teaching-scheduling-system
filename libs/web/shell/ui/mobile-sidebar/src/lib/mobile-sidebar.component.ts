import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  AppShellState,
  logout,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import {
  SidebarField,
  SidebarState,
  sidebar_selectDataState,
} from '@teaching-scheduling-system/web/shell/data-access';
import { SidebarAbstract } from '@teaching-scheduling-system/web/shell/ui/sidebar';
import { delay, take, tap } from 'rxjs';
import { MobileSidebarConstant } from './mobile-sidebar.constant';

@Component({
  selector: 'tss-mobile-sidebar',
  templateUrl: './mobile-sidebar.component.html',
  styleUrls: ['./mobile-sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileSidebarComponent
  extends SidebarAbstract
  implements AfterViewInit
{
  // PUBLIC PROPERTIES
  override readonly items = MobileSidebarConstant.items;

  // CONSTRUCTOR
  constructor(
    router: Router,
    fb: FormBuilder,
    destroy$: TuiDestroyService,
    elementRef: ElementRef,
    sidebarStore: Store<SidebarState>,
    private readonly appShellStore: Store<AppShellState>
  ) {
    super(router, fb, destroy$, elementRef, sidebarStore, appShellStore);
  }

  // LIFECYCLE
  ngAfterViewInit(): void {
    this.breadcrumbs$
      .pipe(
        delay(200),
        tap((breadcrumbs) => {
          const itemNeedOpen = this.accordionItems.find(
            (x) =>
              !!breadcrumbs?.find(
                (b) =>
                  b.label.includes(x.nativeId) || b.group?.includes(x.nativeId)
              )
          );
          // Have to call to close() first
          itemNeedOpen?.close();
          itemNeedOpen?.onRowToggle();
        }),
        take(1)
      )
      .subscribe();
  }

  // PUBLIC METHODS
  onLogout(): void {
    this.appShellStore.dispatch(logout());
    this.clickItem.emit();
  }

  // PROTECTED METHODS
  protected initForm(): void {
    /**
     * form value:
     *  {
     *    calendar: {
     *      exam: true;
     *      study: true;
     *    }
     *  }
     */
    this.sidebarStore
      .select(sidebar_selectDataState)
      .pipe(
        tap((dataState) => {
          this.form = this.fb.group(
            this.items.reduce<Record<string, unknown>>((acc, curr) => {
              if (curr.subCheckboxes && curr.controlName) {
                acc[curr.controlName] = this.fb.group(
                  curr.subCheckboxes.reduce<Record<string, unknown>>(
                    (accControl, currControl) => {
                      const field =
                        `${curr.controlName}.${currControl.controlName}` as SidebarField;
                      accControl[currControl.controlName] = [dataState[field]];
                      return accControl;
                    },
                    {}
                  )
                );
              }
              return acc;
            }, {})
          );
        }),
        take(1)
      )
      .subscribe();
  }
}
