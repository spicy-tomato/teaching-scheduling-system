import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoogleService } from '@services/core/google.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'tss-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingComponent {
  /** PUBLIC PROPERTIES */
  public loggedInGoogle$: BehaviorSubject<boolean | null>;

  /** CONSTRUCTOR */
  constructor(private readonly googleService: GoogleService) {
    this.loggedInGoogle$ = googleService.loggedIn$;
  }

  /** PUBLIC METHODS */
  public connectGoogle(): void {
    this.googleService.auth();
  }

  public signOutGoogle(): void {
    this.googleService.signOut();
  }
}
