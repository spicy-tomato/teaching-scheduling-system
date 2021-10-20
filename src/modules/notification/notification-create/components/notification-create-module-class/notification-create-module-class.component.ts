import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { delay, startWith, switchMap } from 'rxjs/operators';
import { NotificationCreateState } from '../../state/notification-create.state';
import { NotificationCreateClassFormBaseComponent } from '../class-form-base/notification-create-class-form-base.component';

class User {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly avatarUrl: string | null = null,

  ) { }

  public toString(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

const databaseMockData: ReadonlyArray<User> = [
  new User('Roman', 'Sedov', 'http://marsibarsi.me/images/1x1small.jpg'),
  new User('Alex', 'Inkin'),
  new User('Dmitriy', 'Demenskiy'),
  new User('Evgeniy', 'Mamaev'),
  new User('Ivan', 'Ishmametiev'),
  new User('Igor', 'Katsuba'),
  new User('Yulia', 'Tsareva'),
];

@Component({
  selector: 'tss-notification-create-module-class',
  templateUrl: './notification-create-module-class.component.html',
  styleUrls: ['./notification-create-module-class.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationCreateModuleClassComponent extends NotificationCreateClassFormBaseComponent {
  private readonly search$ = new Subject<string>();

  public readonly items$: Observable<ReadonlyArray<User> | null> = this.search$.pipe(
    switchMap(search =>
      this.serverRequest(search)
        .pipe(
          startWith(null)
        ),
    ),
    startWith(databaseMockData),
  );

  constructor(
    protected readonly fb: FormBuilder,
    protected readonly store: Store<NotificationCreateState>
  ) {
    super(fb, store);
  }

  protected initForm(): void {
    this.form = this.fb.group({
      receipt: new FormControl([], [Validators.required]),
      academicYear: new FormArray([]),
    });
  }

  public onSearchChange(searchQuery: string | null): void {
    this.search$.next(searchQuery ?? '');
  }

  /**
   * Server request emulation
   */
  private serverRequest(searchQuery: string): Observable<ReadonlyArray<User>> {
    const result = databaseMockData.filter(
      user =>
        user.toString().toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1,
    );

    return of(result).pipe(delay(1000 * 1));
  }
}
