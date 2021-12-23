/* eslint-disable @typescript-eslint/unbound-method */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AcademicYear } from '@models/core/academic-year.model';
import { Faculty } from '@models/core/faculty.model';
import { ManagingClass } from '@models/core/managing-class.model';
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
  implements OnInit
{
  //#region PUBLIC PROPERTIES
  public readonly academicYears$!: Observable<AcademicYear>;
  public readonly faculties$!: Observable<Faculty[]>;
  public readonly classes$!: Observable<ManagingClass[]>;
  public readonly isButtonLoading$!: Observable<boolean>;
  public selectAllFaculties = false;
  public selectAllAcademicYears = false;
  public selectAllClasses = false;
  //#endregion

  //#region GETTERS
  public get faculties(): FormGroup {
    return this.form.get('faculties') as FormGroup;
  }
  public get academicYears(): FormGroup {
    return this.form.get('academicYears') as FormGroup;
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

    this.classes$ = store
      .select(fromNotificationCreate.selectManagingClasses)
      .pipe(takeUntil(this.destroy$));

    this.isButtonLoading$ = combineLatest([
      this.academicYears$,
      this.faculties$,
    ]).pipe(
      filter((data) => true),
      take(1),
      map(() => false),
      startWith(true)
    );

    this.handleGetAcademicYears();
    this.handleGetFaculties();
    this.handleGetClasses();
  }
  //#endregion

  //#region LIFE CYCLE
  public ngOnInit(): void {
    this.store.dispatch(fromNotificationCreate.loadManagingClassForm());
  }
  //#endregion

  //#region IMPLEMENTATIONS
  protected initForm(): void {
    this.form = this.fb.group({
      receipt: new FormGroup({}),
      faculties: new FormGroup({}),
      academicYears: new FormGroup({}),
    });
  }
  //#endregion

  //#region PUBLIC METHODS
  public allFacultiesPress(all: boolean): void {
    for (const field in this.faculties.controls) {
      this.faculties.get(field)?.setValue(all);
    }
  }

  public onFacultiesChange(choose: boolean): void {
    if (choose) {
      let selectedAll = true;
      for (const field in this.faculties.controls) {
        if (!this.faculties.get(field)?.value) {
          selectedAll = false;
          break;
        }
      }

      this.selectAllFaculties = selectedAll;
    } else {
      if (this.selectAllFaculties) {
        this.selectAllFaculties = false;
      }
    }
  }

  public allAcademicYearsPress(all: boolean): void {
    for (const field in this.academicYears.controls) {
      this.academicYears.get(field)?.setValue(all);
    }
  }

  public onAcademicYearsChange(choose: boolean): void {
    if (choose) {
      let selectedAll = true;
      for (const field in this.academicYears.controls) {
        if (!this.academicYears.get(field)?.value) {
          selectedAll = false;
          break;
        }
      }

      this.selectAllAcademicYears = selectedAll;
    } else {
      if (this.selectAllAcademicYears) {
        this.selectAllAcademicYears = false;
      }
    }
  }

  public allClassesYearsPress(all: boolean): void {
    for (const field in this.academicYears.controls) {
      this.academicYears.get(field)?.setValue(all);
    }
  }

  public onClassesChange(choose: boolean): void {
    if (choose) {
      let selectedAll = true;
      for (const field in this.academicYears.controls) {
        if (!this.academicYears.get(field)?.value) {
          selectedAll = false;
          break;
        }
      }

      this.selectAllAcademicYears = selectedAll;
    } else {
      if (this.selectAllAcademicYears) {
        this.selectAllAcademicYears = false;
      }
    }
  }
  //#endregion

  //#region PRIVATE METHODS
  private handleGetAcademicYears(): void {
    this.academicYears$
      .pipe(
        filter((result) => true),
        tap((result) => {
          const academicYearsControl = new FormGroup({});
          // result.forEach((year) => {
          //   academicYearsControl.addControl(
          //     '',
          //     new FormControl(false)
          //   );
          // });

          this.form.setControl('academicYears', academicYearsControl);
        })
      )
      .subscribe();
  }

  private handleGetFaculties(): void {
    this.faculties$
      .pipe(
        filter((result) => result.length > 0),
        tap((result) => {
          const facultiesControl = new FormGroup({});
          result.forEach((faculty) => {
            facultiesControl.addControl(faculty.id, new FormControl(false));
          });

          this.form.setControl('faculties', facultiesControl);
        })
      )
      .subscribe();
  }

  private handleGetClasses(): void {
    combineLatest([this.academicYears$, this.faculties$])
      .pipe(
        tap((result) => {
          this.store.dispatch(
            fromNotificationCreate.loadManagingClasses({
              academicYears: [],
              faculties: result[1].map((x) => x.id),
            })
          );
        })
      )
      .subscribe();

    this.classes$
      .pipe(
        filter((result) => result.length > 0),
        tap((result) => {
          const classesControl = new FormGroup({});
          result.forEach((_class) => {
            classesControl.addControl(_class.name, new FormControl(false));
          });

          this.form.setControl('receipt', classesControl);
        })
      )
      .subscribe();
  }
  //#endregion
}
