import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { Teacher } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AppShellState,
  selectNotNullTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { NavbarService } from '@teaching-scheduling-system/web/shell/ui/navbar';
import {
  teachingScheduleRequestChangeOptions,
  teachingScheduleRequestFilter,
  teachingScheduleRequestReset,
  TeachingScheduleRequestState,
} from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { Observable, takeUntil, tap } from 'rxjs';

@Component({
  templateUrl: './change-request.component.html',
  styleUrls: ['./change-request.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ChangeRequestComponent implements AfterViewInit {
  // VIEWCHILD
  @ViewChild('rightMenu') rightMenuTemplate!: TemplateRef<never>;

  // PRIVATE PROPERTIES
  private readonly teacher$: Observable<Teacher>;

  // CONSTRUCTOR
  constructor(
    private readonly navbarService: NavbarService,
    private readonly store: Store<TeachingScheduleRequestState>,
    private readonly appShellStore: Store<AppShellState>,
    private readonly destroy$: TuiDestroyService,
    route: ActivatedRoute
  ) {
    const personal = route.snapshot.data['personal'] as boolean;
    store.dispatch(teachingScheduleRequestReset({ personal }));

    this.teacher$ = this.appShellStore.pipe(
      selectNotNullTeacher,
      takeUntil(this.destroy$)
    );

    if (personal) {
      this.handleSelectTeacher();
    } else {
      this.store.dispatch(
        teachingScheduleRequestFilter({
          query: {
            status: [],
            page: 1,
            pagination: 20,
          },
        })
      );
    }
  }

  // LIFECYCLE
  ngAfterViewInit(): void {
    this.navbarService.addRightMenu(this.rightMenuTemplate);
  }

  // PRIVATE METHODS
  private handleSelectTeacher(): void {
    this.teacher$
      .pipe(
        tap((teacher) => {
          this.store.dispatch(
            teachingScheduleRequestChangeOptions({
              options: { teacher },
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
