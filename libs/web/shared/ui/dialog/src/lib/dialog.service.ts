import { Inject, Injectable, Injector } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ConfirmDialogOptions } from './dialog-options';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  // CONSTRUCTOR 
  constructor(
    private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {}

  // PUBLIC METHODS 
  showConfirmDialog<T extends ConfirmDialogOptions>(
    data: Partial<T>
  ): Observable<boolean> {
    return this.dialogService.open<boolean>(
      new PolymorpheusComponent(ConfirmDialogComponent, this.injector),
      { data }
    );
  }
}
