import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { GoogleService } from '@services/core/google.service';
import { BehaviorSubject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'tss-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingComponent extends BaseComponent implements OnInit {
  /** PUBLIC PROPERTIES */
  public loggedInGoogle$: BehaviorSubject<boolean | null>;

  /** CONSTRUCTOR */
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly googleService: GoogleService
  ) {
    super();
    this.loggedInGoogle$ = googleService.loggedIn$;
  }

  public ngOnInit(): void {
    this.loggedInGoogle$
      .pipe(
        filter((x) => !!x),
        tap(() => this.cdr.detectChanges()),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  /** PUBLIC METHODS */
  public connectGoogle(): void {
    this.googleService.auth();
  }

  public signOutGoogle(): void {
    this.googleService.signOut();
  }

  public other(): void {
    void gapi.auth2
      .getAuthInstance().currentUser.get()
      .grantOfflineAccess({
        prompt: 'consent',
        scope: 'https://www.googleapis.com/auth/calendar',
      })
      .then(function (resp) {
        console.log(resp.code);
      });

    // console.log(gapi.client.getToken());
  }

  public other2(): void {
    void gapi.auth2
      .getAuthInstance()
      .grantOfflineAccess({
        scope: 'https://www.googleapis.com/auth/calendar',
      })
      .then(function (resp) {
        console.log(resp.code);
      });

    console.log(gapi.client.getToken());
  }
}
