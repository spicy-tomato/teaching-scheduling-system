import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from '@modules/core/base/base.component';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { ObservableHelper } from '@shared/helpers';
import { Teacher } from '@shared/models';
import { Observable } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';

@Component({
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInformationComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
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
    },
  ];

  /** PRIVATE PROPERTIES */
  private readonly teacher$: Observable<Teacher>;

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.teacher$ = appShellStore
      .select(fromAppShell.selectTeacher)
      .pipe(ObservableHelper.filterNullish(), takeUntil(this.destroy$));

    this.initForm();
    this.triggerLoadUserInformation();
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    this.form = this.fb.group({
      name: [],
      department: [],
      faculty: [],
      phone: [],
    });
  }

  private triggerLoadUserInformation(): void {
    this.teacher$
      .pipe(
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
}
