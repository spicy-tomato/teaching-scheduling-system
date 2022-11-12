import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Teacher } from '@teaching-scheduling-system/web/shared/data-access/models';
import { NavbarService } from '@teaching-scheduling-system/web/shell/ui/navbar';
import { RequestStore } from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { Observable, tap } from 'rxjs';

@Component({
  templateUrl: './change-request.component.html',
  styleUrls: ['./change-request.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeRequestComponent implements AfterViewInit {
  // VIEWCHILD
  @ViewChild('rightMenu') rightMenuTemplate!: TemplateRef<never>;

  // PRIVATE PROPERTIES
  private readonly teacher$: Observable<Teacher>;

  // CONSTRUCTOR
  constructor(
    private readonly navbarService: NavbarService,
    private readonly store: RequestStore,
    route: ActivatedRoute
  ) {
    const personal = route.snapshot.data['personal'] as boolean;
    store.reset(personal);

    this.teacher$ = store.teacher$;

    if (personal) {
      this.handleSelectTeacher();
    } else {
      store.filter({
        status: [],
        page: 1,
      });
    }
  }

  // LIFECYCLE
  ngAfterViewInit(): void {
    this.navbarService.addRightMenu(this.rightMenuTemplate);
  }

  // PRIVATE METHODS
  private handleSelectTeacher(): void {
    this.teacher$
      .pipe(tap((teacher) => this.store.changeOptions({ teacher })))
      .subscribe();
  }
}
