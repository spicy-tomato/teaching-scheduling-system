import {
  ChangeDetectorRef,
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  AppShellState,
  selectPermission,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import {
  combineLatest,
  filter,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

@Directive({
  selector: '[tssPermission]',
  providers: [TuiDestroyService],
})
export class PermissionDirective {
  /** PRIVATE PROPERTIES */
  private _tssPermission?: number | null;
  private permissions$: Observable<number[]>;
  private bind$ = new Subject<void>();
  private hadElse = false;

  /** SETTER */
  @Input() set tssPermission(permissions: number | undefined | null) {
    this._tssPermission = permissions;
    this.bind$.next();
  }

  @Input() set tssPermissionElse(templateRef: TemplateRef<unknown>) {
    this.elseThenTemplateRef = templateRef;
    this.hadElse = true;
    this.bind$.next();
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly thenTemplateRef: TemplateRef<unknown>,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly cdr: ChangeDetectorRef,
    private elseThenTemplateRef: TemplateRef<unknown>,
    appShellStore: Store<AppShellState>,
    destroy$: TuiDestroyService
  ) {
    this.permissions$ = appShellStore
      .select(selectPermission)
      .pipe(takeUntil(destroy$));

    this.triggerUpdateView();
  }

  /** PRIVATE METHODS */
  private triggerUpdateView(): void {
    combineLatest([this.permissions$.pipe(filter((x) => !!x)), this.bind$])
      .pipe(tap(([permissions]) => this.updateView(permissions)))
      .subscribe();
  }

  private updateView(permissions?: number[]): void {
    const accept = this._tssPermission;
    this.viewContainerRef.clear();
    if (!accept || permissions?.includes(accept)) {
      this.viewContainerRef.createEmbeddedView(this.thenTemplateRef);
      this.cdr.detectChanges();
    } else if (this.hadElse) {
      this.viewContainerRef.createEmbeddedView(this.elseThenTemplateRef);
      this.cdr.detectChanges();
    }
  }
}
