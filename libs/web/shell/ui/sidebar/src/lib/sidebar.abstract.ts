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
import { Observable, takeUntil } from 'rxjs';
import { SidebarService } from './sidebar.service';

@Directive({
  providers: [TuiDestroyService],
})
export abstract class SidebarAbstract implements OnInit {
  /** VIEW CHILD */
  @ViewChildren(TuiAccordionItemComponent)
  public accordionItems!: QueryList<TuiAccordionItemComponent>;

  /** OUTPUT */
  @Output() public readonly clickItem = new EventEmitter<void>();

  /** PUBLIC PROPERTIES */
  public abstract readonly items: SidebarItem[];
  public form!: FormGroup;

  /** PRIVATE PROPERTIES */
  protected readonly breadcrumbs$: Observable<BreadcrumbItem[]>;

  /** CONSTRUCTOR */
  constructor(
    protected readonly router: Router,
    protected readonly fb: FormBuilder,
    protected readonly sidebarService: SidebarService,
    protected readonly destroy$: TuiDestroyService,
    protected readonly elementRef: ElementRef,
    appShellStore: Store<AppShellState>
  ) {
    this.breadcrumbs$ = appShellStore
      .select(selectBreadcrumbs)
      .pipe(takeUntil(destroy$));
  }

  /** LIFECYCLE */
  public ngOnInit(): void {
    this.initForm();
  }

  public onClickItem(item: SidebarItem): void {
    if (item.subCheckboxes) {
      if (item.routerLink?.includes('calendar')) {
        void this.router.navigate(['/calendar']);
        this.clickItem.emit();
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

  /** PROTECTED METHODS */
  protected abstract initForm(): void;
}
