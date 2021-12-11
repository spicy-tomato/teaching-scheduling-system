import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Teacher } from '@models/core/teacher.model';
import { UserService } from '@services/user.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class UserInfoResolve implements Resolve<Teacher | undefined> {
  /** CONSTRUCTOR */
  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  /** IMPLEMENTATIONS */
  public resolve(): Observable<Teacher | undefined> {
    return this.userService.me().pipe(
      map(
        (teacher) => {
          if (!teacher) throw Error();
          return teacher;
        },
        catchError(() => {
          void this.router.navigate(['/login']);
          return of(undefined);
        })
      )
    );
  }
}
