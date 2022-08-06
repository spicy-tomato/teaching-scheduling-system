import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { sidebar_emit } from '@teaching-scheduling-system/web/shell/data-access';
import { filter, delay, tap, take, takeUntil } from 'rxjs';
import { SidebarAbstract } from './sidebar.abstract';
import { SidebarConstant } from './sidebar.constant';

@Component({
  selector: 'tss-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent extends SidebarAbstract implements AfterViewInit {
  // PUBLIC PROPERTIES 
  items = SidebarConstant.items;

  // LIFECYCLE 
  ngAfterViewInit(): void {
    this.breadcrumbs$
      .pipe(
        delay(2000),
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

    this.sidebarStore.dispatch(
      sidebar_emit({
        event: {
          name: 'calendar.create',
          value: ['calendar.study', 'calendar.exam'],
        },
      })
    );
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
