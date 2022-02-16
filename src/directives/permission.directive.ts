import {
  ChangeDetectorRef,
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { BaseComponent } from '@modules/core/base/base.component';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { combineLatest, Observable, Subject } from 'rxjs';

@Directive({
  selector: '[tssPermission]',
})
export class PermissionDirective extends BaseComponent {
  /** PRIVATE PROPERTIES */
  private _tssPermission?: number | null;
  private permissions$: Observable<number[]>;
  private bind$ = new Subject();

  /** SETTER */
  @Input() public set tssPermission(permissions: number | undefined | null) {
    this._tssPermission = permissions;
    this.bind$.next();
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly templateRef: TemplateRef<unknown>,
    private readonly viewContainer: ViewContainerRef,
    private readonly cdr: ChangeDetectorRef,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.assignSubjects([this.bind$]);

    this.permissions$ = appShellStore
      .select(fromAppShell.selectPermission)
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
    if (!accept || permissions?.includes(accept)) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.cdr.detectChanges();
    } else {
      this.viewContainer.clear();
    }
  }
}
