import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UserService } from '@services/user.service';
import { TuiInputComponent } from '@taiga-ui/kit';
import { Observable, of, Subject } from 'rxjs';
import {
  catchError,
  finalize,
  map,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { Teacher, UserInformationFields } from '@shared/models';
import { BaseComponent } from '@modules/core/base/base.component';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';

@Component({
  selector: 'tss-user-information-edit-field',
  templateUrl: './user-information-edit-field.component.html',
  styleUrls: ['./user-information-edit-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: UserInformationEditFieldComponent,
    },
  ],
})
export class UserInformationEditFieldComponent
  extends BaseComponent
  implements ControlValueAccessor
{
  /** INPUT */
  @Input() public field!: string;

  /** VIEWCHILD */
  @ViewChild(TuiInputComponent) public inputComponent!: TuiInputComponent;

  /** PUBLIC PROPERTIES */
  public initialValue = '';
  public value = '';
  public disableInput = true;
  public processing = false;
  public save$ = new Subject<void>();

  /** PRIVATE PROPERTIES */
  private onChange!: (value: string) => void;
  private readonly teacher$: Observable<Teacher>;

  /** CONSTRUCTOR */
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly userService: UserService,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.teacher$ = appShellStore.pipe(
      fromAppShell.selectNotNullTeacher,
      takeUntil(this.destroy$)
    );

    this.handleSave();
  }

  /** IMPLEMENTATIONS */
  public writeValue(value: string): void {
    this.initialValue = this.value = value;
    this.cdr.markForCheck();
  }

  public registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }

  public registerOnTouched(): void {
    // Do nothing
  }

  /** PUBLIC METHODS */
  public onValueChange(value: string): void {
    this.value = value;
  }

  public onEdit(): void {
    this.disableInput = false;
    this.inputComponent.nativeFocusableElement?.focus();
  }

  public onCancel(): void {
    this.disableInput = true;
    this.value = this.initialValue;
  }

  /** PRIVATE METHODS */
  private handleSave(): void {
    this.save$
      .pipe(
        withLatestFrom(this.teacher$),
        map((x) => x[1]),
        tap((teacher) => {
          this.processing = true;
          const body = {
            [this.field as UserInformationFields]: this.value,
          };

          this.userService
            .updateInformation(body, teacher.uuidAccount)
            .pipe(
              tap(() => this.onSaveSuccessful()),
              catchError(() => {
                this.onSaveFailed();
                return of(null);
              }),
              finalize(() => {
                this.disableInput = true;
                this.processing = false;
                this.cdr.markForCheck();
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  private onSaveSuccessful(): void {
    this.writeValue(this.value);
    this.onChange(this.value);
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
