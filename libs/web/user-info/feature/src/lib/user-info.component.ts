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
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { ObservableHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { Teacher } from '@teaching-scheduling-system/web/shared/data-access/models';
import { UserService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { ConfirmInputComponent } from '@teaching-scheduling-system/web/shared/ui/components/confirm-input';
import {
  catchError,
  finalize,
  Observable,
  of,
  Subject,
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
  /** PUBLIC PROPERTIES */
  public readonly fields = [
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
  public readonly save$ = new Subject<{
    controlName: string;
    value: string;
  }>();
  public readonly teacher$: Observable<Nullable<Teacher>>;
  public form!: FormGroup;

  /** VIEW CHILDREN */
  @ViewChildren(ConfirmInputComponent)
  confirmInputs!: QueryList<ConfirmInputComponent>;

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly destroy$: TuiDestroyService,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    appShellStore: Store<AppShellState>
  ) {
    this.teacher$ = appShellStore
      .select(selectTeacher)
      .pipe(takeUntil(this.destroy$));

    this.initForm();
    this.triggerLoadUserInformation();
    this.handleSave();
  }

  /** PUBLIC METHODS */

  /** PRIVATE METHODS */
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
        ObservableHelper.filterNullish(),
        tap((teacher) => {
          this.form.patchValue({
            name: teacher.name,
            department: teacher.department.name,
            faculty: teacher.faculty.name,
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
        withLatestFrom(this.teacher$.pipe(ObservableHelper.filterNullish())),
        tap(([{ controlName, value }, teacher]) => {
          const body = { [controlName]: value };
          const confirmInput = this.confirmInputs.find(
            (x) => x.field === controlName
          );

          this.userService
            .updateInformation(body, teacher.uuidAccount)
            .pipe(
              tap(() => {
                confirmInput?.saveValue();
                this.onSaveSuccessful();
              }),
              catchError(() => {
                this.onSaveFailed();
                return of(null);
              }),
              finalize(() => {
                confirmInput?.finish();
              })
            )
            .subscribe();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private onSaveSuccessful(): void {
    this.notificationsService
      .show('Cập nhật thông tin thành công', {
        status: TuiNotification.Success,
      })
      .subscribe();
  }

  private onSaveFailed(): void {
    this.notificationsService
      .show('Vui lòng thử lại sau', {
        label: 'Lỗi hệ thống',
        status: TuiNotification.Error,
      })
      .subscribe();
  }
}
