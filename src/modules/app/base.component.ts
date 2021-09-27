import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export abstract class BaseComponent implements OnDestroy {
  protected destroy$ = new Subject();

  constructor() { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
