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
  Observable,
  Subject,
  takeUntil,
  combineLatest,
  filter,
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
  @Input() public set tssPermission(permissions: number | undefined | null) {
    this._tssPermission = permissions;
    this.bind$.next();
  }

  @Input() public set tssPermissionElse(templateRef: TemplateRef<unknown>) {
    this.elseThenTemplateRef = templateRef;
    this.hadElse = true;
    this.bind$.next();
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly thenTemplateRef: TemplateRef<unknown>,
    private readonly viewContainer: ViewContainerRef,
    private readonly cdr: ChangeDetectorRef,
    private elseThenTemplateRef: TemplateRef<unknown>,
    private readonly destroy$: TuiDestroyService,
    appShellStore: Store<AppShellState>
  ) {
    this.permissions$ = appShellStore
      .select(selectPermission)
      .pipe(takeUntil(this.destroy$));

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
    this.viewContainer.clear();

    if (!accept || permissions?.includes(accept)) {
      this.viewContainer.createEmbeddedView(this.thenTemplateRef);
      this.cdr.detectChanges();
    } else if (this.hadElse) {
      this.viewContainer.createEmbeddedView(this.elseThenTemplateRef);
      this.cdr.detectChanges();
    }
  }
}
