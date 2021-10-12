import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export abstract class BaseComponent implements OnDestroy {
  protected destroy$ = new Subject();

  public ngOnDestroy(): void {
    this.beforeDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected beforeDestroy(): unknown {
    return;
  }
}
