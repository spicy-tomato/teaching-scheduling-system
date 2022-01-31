import { Directive, OnDestroy } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

type SubjectType = Subject<unknown> | BehaviorSubject<any> | ReplaySubject<any>;

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
      console.log(subject);
      subject.complete();
    });
  }

  public assignSubjects(subjects: SubjectType[]): void {
    this.subjects = subjects;
  }

  /** PROTECTED METHODS */
  protected beforeDestroy(): unknown {
    return;
  }
}
