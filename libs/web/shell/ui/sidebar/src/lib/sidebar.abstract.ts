import {
  Directive,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
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
import {
  SidebarField,
  SidebarState,
  sidebar_emit,
  sidebar_selectGoogleCalendarList,
  sidebar_selectGoogleCalendarStatus,
} from '@teaching-scheduling-system/web/shell/data-access';
import { Observable, takeUntil } from 'rxjs';

@Directive({
  providers: [TuiDestroyService],
})
export abstract class SidebarAbstract implements OnInit {
  // VIEW CHILD
  @ViewChildren(TuiAccordionItemComponent)
  accordionItems!: QueryList<TuiAccordionItemComponent>;

  // OUTPUT
  @Output() readonly clickItem = new EventEmitter<void>();

  // PUBLIC PROPERTIES
  // TODO: remove
  readonly googleCalendarStatus$ = this.store.select(
    sidebar_selectGoogleCalendarStatus
  );
  readonly googleCalendarList$ = this.store.select(
    sidebar_selectGoogleCalendarList
  );
  abstract readonly items: SidebarItem[];
  form!: FormGroup;

  // PROTECTED PROPERTIES
  protected readonly breadcrumbs$: Observable<BreadcrumbItem[]>;

  // CONSTRUCTOR
  constructor(
    protected readonly router: Router,
    protected readonly fb: FormBuilder,
    protected readonly destroy$: TuiDestroyService,
    protected readonly elementRef: ElementRef,
    protected readonly store: Store<SidebarState>,
    protected readonly appShellStore: Store<AppShellState>
  ) {
    this.breadcrumbs$ = appShellStore
      .select(selectBreadcrumbs)
      .pipe(takeUntil(destroy$));
  }

  // LIFECYCLE
  ngOnInit(): void {
    this.initForm();
    this.handleLoadGoogleCalendarList();
  }

  // PUBLIC METHODS
  onClickItem(item: SidebarItem): void {
    if (item.subCheckboxes) {
      if (item.routerLink?.includes('calendar')) {
        void this.router.navigate(['/calendar']);
        this.clickItem.emit();
      }
    }
  }

  onClickCheckbox(controlName: string, value: boolean): void {
    const name = controlName as SidebarField;
    this.store.dispatch(
      sidebar_emit({
        event: {
          name,
          value,
        },
      })
    );
  }

  // PROTECTED METHODS
  protected abstract initForm(): void;

  protected abstract handleLoadGoogleCalendarList(): void;
}
