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
  SidebarState,
  sidebar_emit,
} from '@teaching-scheduling-system/web/shell/data-access';
import { Observable, takeUntil } from 'rxjs';

@Directive({
  providers: [TuiDestroyService],
})
export abstract class SidebarAbstract implements OnInit {
  /** VIEW CHILD */
  @ViewChildren(TuiAccordionItemComponent)
  accordionItems!: QueryList<TuiAccordionItemComponent>;

  /** OUTPUT */
  @Output() readonly clickItem = new EventEmitter<void>();

  /** PUBLIC PROPERTIES */
  abstract readonly items: SidebarItem[];
  form!: FormGroup;

  /** PRIVATE PROPERTIES */
  protected readonly breadcrumbs$: Observable<BreadcrumbItem[]>;

  /** CONSTRUCTOR */
  constructor(
    protected readonly router: Router,
    protected readonly fb: FormBuilder,
    protected readonly destroy$: TuiDestroyService,
    protected readonly elementRef: ElementRef,
    protected readonly sidebarStore: Store<SidebarState>,
    appShellStore: Store<AppShellState>
  ) {
    this.breadcrumbs$ = appShellStore
      .select(selectBreadcrumbs)
      .pipe(takeUntil(destroy$));
  }

  /** LIFECYCLE */
  ngOnInit(): void {
    this.initForm();
  }

  onClickItem(item: SidebarItem): void {
    if (item.subCheckboxes) {
      if (item.routerLink?.includes('calendar')) {
        void this.router.navigate(['/calendar']);
        this.clickItem.emit();
      }
    }
  }

  onClickCheckbox(controlName: string, value: boolean): void {
    const name = controlName as
      | 'calendar.study'
      | 'calendar.exam'
      | `calendar.@${string}`;
    this.sidebarStore.dispatch(sidebar_emit({ event: { name, value } }));
  }

  /** PROTECTED METHODS */
  protected abstract initForm(): void;
}
