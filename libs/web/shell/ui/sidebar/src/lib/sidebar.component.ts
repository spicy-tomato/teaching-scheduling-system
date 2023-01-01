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

    this.store.dispatch(
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
      this.items.reduce<Record<string, unknown>>(
        (acc, { subCheckboxes, controlName }) => {
          if (subCheckboxes && controlName) {
            acc[controlName] = this.fb.group(
              subCheckboxes.reduce<Record<string, unknown>>(
                (accControl, currControl) => {
                  accControl[currControl.controlName] = [true];
                  return accControl;
                },
                {}
              )
            );
          }
          return acc;
        },
        {}
      )
    );
  }

  protected handleLoadGoogleCalendarList(): void {
    this.googleCalendarList$
      .pipe(
        filter(({ length }) => length > 0),
        tap((list) => {
          const newList = [...this.items];
          // TODO: Display calendars
          // const googleCalendarItems = list.map(({ id, summary }) => ({
          //   controlName: id,
          //   name: summary,
          // }));
          const calendarControl = newList.find(
            (item) => item.controlName === 'calendar'
          );
          if (calendarControl && calendarControl.subCheckboxes) {
            calendarControl.subCheckboxes =
              calendarControl.subCheckboxes.filter(
                // TODO: Refactor
                (s) => s.controlName === 'study' || s.controlName === 'exam'
              );
            // TODO: Display calendars
            // calendarControl.subCheckboxes.push(...googleCalendarItems);
            calendarControl.subCheckboxes.push({
              controlName: 'googleEvent',
              name: 'Lịch Google',
            });
          }
          this.initForm();
        })
      )
      .subscribe();
  }
}
