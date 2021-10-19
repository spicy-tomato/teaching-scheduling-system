/* eslint-disable @typescript-eslint/unbound-method */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { AcademicYear } from '@models/core/academic-year.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import * as fromNotificationCreate from '../../state';
import { NotificationCreateClassFormBaseComponent } from '../class-form-base/notification-create-class-form-base.component';

@Component({
  selector: 'tss-notification-create-managing-class',
  templateUrl: './notification-create-managing-class.component.html',
  styleUrls: ['./notification-create-managing-class.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCreateManagingClassComponent
  extends NotificationCreateClassFormBaseComponent
  implements OnInit {

  //#region PUBLIC PROPERTIES
  public academicYear$!: Observable<AcademicYear[]>;
  //#endregion


  //#region CONSTRUCTOR
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly store: Store<fromNotificationCreate.NotificationCreateState>
  ) {
    super(fb, store);

    this.academicYear$ = store
      .select(fromNotificationCreate.selectAcademicYears)
      .pipe(takeUntil(this.destroy$));

    this.handleGetAcademicYear();
  }
  //#endregion


  //#region LIFE CYCLE
  public ngOnInit(): void {
    this.store.dispatch(fromNotificationCreate.loadManagingClass());
  }
  //#endregion


  //#region PRIVATE METHODS
  private handleGetAcademicYear(): void {
    this.academicYear$.pipe(
      tap((academicYear) => {
        this.form = this.fb.group({
          receipt: new FormControl([], [Validators.required]),
          academicYear: new FormArray(
            academicYear.map(() => new FormControl(false))
          ),
        });
      })
    ).subscribe();
  }
  //#endregion
}
