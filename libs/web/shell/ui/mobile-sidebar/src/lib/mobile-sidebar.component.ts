import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import { logout } from '@teaching-scheduling-system/web/shared/data-access/store';
import {
  SidebarField,
  sidebar_selectDataState,
} from '@teaching-scheduling-system/web/shell/data-access';
import { SidebarAbstract } from '@teaching-scheduling-system/web/shell/ui/sidebar';
import { delay, filter, Subject, take, tap, withLatestFrom } from 'rxjs';
import { MobileSidebarConstant } from './mobile-sidebar.constant';

@Component({
  selector: 'tss-mobile-sidebar',
  templateUrl: './mobile-sidebar.component.html',
  styleUrls: ['./mobile-sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileSidebarComponent
  extends SidebarAbstract
  implements OnInit, AfterViewInit
{
  // PUBLIC PROPERTIES
  override readonly items = MobileSidebarConstant.items;

  // PRIVATE PROPERTIES
  private readonly initFormSubject$ = new Subject<void>();
  private readonly dataState$ = this.store.select(sidebar_selectDataState);

  // LIFECYCLE
  override ngOnInit(): void {
    this.handleInitForm();
    super.ngOnInit();
  }

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
    this.initFormSubject$.next();
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

  // PRIVATE METHODS
  private handleInitForm(): void {
    /**
     * form value:
     *  {
     *    calendar: {
     *      exam: true;
     *      study: true;
     *    }
     *  }
     */
    this.initFormSubject$
      .pipe(
        withLatestFrom(this.dataState$),
        tap(({ 1: dataState }) => {
          console.log(dataState);

          this.form = this.fb.group(
            this.items.reduce<Record<string, unknown>>(
              (acc, { subCheckboxes, controlName }) => {
                if (subCheckboxes && controlName) {
                  acc[controlName] = this.fb.group(
                    subCheckboxes.reduce<Record<string, unknown>>(
                      (accControl, currControl) => {
                        const field =
                          `${controlName}.${currControl.controlName}` as SidebarField;
                        accControl[currControl.controlName] = [
                          dataState[field],
                        ];
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
        })
      )
      .subscribe();
  }
}
