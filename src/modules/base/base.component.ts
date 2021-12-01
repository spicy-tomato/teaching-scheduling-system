import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export abstract class BaseComponent implements OnDestroy {
  /** PROTECTED PROPERTIES */
  protected destroy$ = new Subject();

  /** LIFE CYCLE */
  public ngOnDestroy(): void {
    this.beforeDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** PROTECTED METHODS */
  protected beforeDestroy(): unknown {
    return;
  }
}
