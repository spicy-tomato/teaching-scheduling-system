/* eslint-disable @typescript-eslint/unbound-method */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AcademicYear } from '@models/core/academic-year.model';
import { Faculty } from '@models/core/faculty.model';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, startWith, take, takeUntil, tap } from 'rxjs/operators';
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
  public readonly academicYears$!: Observable<AcademicYear[]>;
  public readonly faculties$!: Observable<Faculty[]>;
  public readonly isButtonLoading$!: Observable<boolean>;
  public selectAllFaculties = false;
  public selectAllAcademicYears = false;
  //#endregion


  //#region GETTERS
  private get faculties(): FormArray {
    return this.form.get('faculties') as FormArray;
  }
  private get academicYears(): FormArray {
    return this.form.get('academicYears') as FormArray;
  }
  //#endregion


  //#region CONSTRUCTOR
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly store: Store<fromNotificationCreate.NotificationCreateState>
  ) {
    super(fb, store);

    this.academicYears$ = store
      .select(fromNotificationCreate.selectAcademicYears)
      .pipe(takeUntil(this.destroy$));

    this.faculties$ = store
      .select(fromNotificationCreate.selectFaculties)
      .pipe(takeUntil(this.destroy$));

    this.isButtonLoading$ = combineLatest([this.academicYears$, this.faculties$])
      .pipe(
        filter(data => data[0].length > 0 && data[1].length > 0),
        take(1),
        map(() => false),
        startWith(true),
      );

    this.handleGetAcademicYears();
    this.handleGetFaculties();
  }
  //#endregion


  //#region LIFE CYCLE
  public ngOnInit(): void {
    this.store.dispatch(fromNotificationCreate.loadManagingClass());
  }
  //#endregion


  //#region IMPLEMENTATIONS
  protected initForm(): void {
    this.form = this.fb.group({
      receipt: new FormControl([], [Validators.required]),
      faculties: new FormArray([]),
      academicYears: new FormArray([]),
    });
  }
  //#endregion


  //#region PUBLIC METHODS
  public allFacultiesPress(all: boolean): void {
    this.faculties?.setValue(
      Array.from({ length: this.faculties.length }, () => all)
    );
  }

  public onFacultiesChange(choose: boolean): void {
    if (choose){
      if ((this.faculties.value as []).find(x => x === false) === undefined) {
        this.selectAllFaculties = true;
      }
    }
    else {
      if (this.selectAllFaculties) {
        this.selectAllFaculties = false;
      }
    }
  }

  public allAcademicYearsPress(all: boolean): void {
    this.academicYears?.setValue(
      Array.from({ length: this.academicYears.length }, () => all)
    );
  }

  public onAcademicYearsChange(choose: boolean): void {
    if (choose){
      if ((this.academicYears.value as []).find(x => x === false) === undefined) {
        this.selectAllAcademicYears = true;
      }
    }
    else {
      if (this.selectAllAcademicYears) {
        this.selectAllAcademicYears = false;
      }
    }
  }
  //#endregion


  //#region PRIVATE METHODS
  private handleGetAcademicYears(): void {
    this.academicYears$.pipe(
      filter((academicYears) => academicYears.length > 0),
      tap((academicYears) => {
        this.form.setControl('academicYears', new FormArray(
          academicYears.map(() => new FormControl(false))
        ));
      })
    ).subscribe();
  }

  private handleGetFaculties(): void {
    this.faculties$.pipe(
      tap((faculties) => {
        this.form.setControl('faculties', new FormArray(
          faculties.map(() => new FormControl(false))
        ));
      })
    ).subscribe();
  }
  //#endregion
}
