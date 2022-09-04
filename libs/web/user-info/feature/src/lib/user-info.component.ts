import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { Teacher } from '@teaching-scheduling-system/web/shared/data-access/models';
import { UserService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectNotNullTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { ConfirmInputComponent } from '@teaching-scheduling-system/web/shared/ui/components/confirm-input';
import {
  catchError,
  finalize,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

@Component({
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UserInfoComponent {
  // PUBLIC PROPERTIES
  readonly fields = [
    {
      formControlName: 'name',
      placeholder: 'Họ và tên',
    },
    {
      formControlName: 'department',
      placeholder: 'Bộ môn',
    },
    {
      formControlName: 'faculty',
      placeholder: 'Khoa',
    },
    {
      formControlName: 'phone',
      placeholder: 'Số điện thoại',
      editable: true,
      type: 'input-phone',
    },
  ];
  readonly save$ = new Subject<{
    controlName: string;
    value: string;
  }>();
  form!: FormGroup;

  // VIEW CHILDREN
  @ViewChildren(ConfirmInputComponent)
  confirmInputs!: QueryList<ConfirmInputComponent>;

  // PRIVATE PROPERTIES
  private readonly teacher$: Observable<Teacher>;

  // CONSTRUCTOR
  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly destroy$: TuiDestroyService,
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    appShellStore: Store<AppShellState>
  ) {
    this.teacher$ = appShellStore.pipe(
      selectNotNullTeacher,
      takeUntil(this.destroy$)
    );

    this.initForm();
    this.triggerLoadUserInformation();
    this.handleSave();
  }

  // PRIVATE METHODS
  private initForm(): void {
    this.form = this.fb.group({
      name: [],
      department: [],
      faculty: [],
      phone: ['', Validators.minLength(12)],
    });
  }

  private triggerLoadUserInformation(): void {
    this.teacher$
      .pipe(
        tap((teacher) => {
          this.form.patchValue({
            name: teacher.name,
            // TODO: Hide component
            department: teacher.department?.name,
            faculty: teacher.faculty?.name,
            phone: teacher.phone || '',
          });
        }),
        take(1)
      )
      .subscribe();
  }

  private handleSave() {
    this.save$
      .pipe(
        withLatestFrom(this.teacher$),
        switchMap(([{ controlName, value }, teacher]) => {
          const body = { [controlName]: value };
          const confirmInput = this.confirmInputs.find(
            (x) => x.field === controlName
          );

          return this.userService
            .updateInformation(body, teacher.uuidAccount)
            .pipe(
              tap(() => {
                confirmInput?.saveValue();
                this.onSaveSuccessful();
              }),
              catchError(() => {
                this.onSaveFailed();
                return of({});
              }),
              finalize(() => confirmInput?.finish())
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private onSaveSuccessful(): void {
    this.alertService
      .open('Cập nhật thông tin thành công', {
        status: TuiNotification.Success,
      })
      .subscribe();
  }

  private onSaveFailed(): void {
    this.alertService
      .open('Vui lòng thử lại sau', {
        label: 'Lỗi hệ thống',
        status: TuiNotification.Error,
      })
      .subscribe();
  }
}
