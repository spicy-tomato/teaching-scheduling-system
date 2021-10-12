import { Inject, Injectable, Injector } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { TuiDialogService } from '@taiga-ui/core';
import { Observable } from 'rxjs';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { FormDiscardDialogComponent } from '@modules/shared/dialog/form-discard-dialog/form-discard-dialog.component';
import { ICanDeactivateComponent } from '@modules/base/can-deactivate.base';

@Injectable({
  providedIn: 'root'
})
export class FormDiscardGuard<T extends ICanDeactivateComponent> implements CanDeactivate<T> {
  constructor(
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService
  ) { }

  public canDeactivate(component: T): Observable<boolean> | Promise<boolean> | boolean {
    return component?.canDeactivate() ?? this.showExitConfirmDialog();
  }

  private showExitConfirmDialog(): Observable<boolean> {
    return this.dialogService
      .open<boolean>(
        new PolymorpheusComponent(FormDiscardDialogComponent, this.injector),
      );
  }
}
