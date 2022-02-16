import { Directive, OnDestroy } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SubjectType = Subject<any> | BehaviorSubject<any> | ReplaySubject<any>;

@Directive()
export abstract class BaseComponent implements OnDestroy {
  /** PROTECTED PROPERTIES */
  protected destroy$ = new Subject();

  /** PRIVATE PROPERTIES */
  private subjects?: SubjectType[];

  /** LIFE CYCLE */
  public ngOnDestroy(): void {
    this.beforeDestroy();
    this.destroy$.next();
    this.destroy$.complete();

    this.subjects?.forEach((subject) => {
      subject.complete();
    });
  }

  /** PUBLIC METHODS */
  public assignSubjects(subjects: SubjectType[]): void {
    this.subjects = subjects;
  }

  /** PROTECTED METHODS */
  protected beforeDestroy(): unknown {
    return;
  }
}
