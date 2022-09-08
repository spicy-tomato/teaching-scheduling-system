import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { IconConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { GoogleService } from '@teaching-scheduling-system/web/shared/data-access/services';

@Component({
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ShellComponent {
  // VIEW CHILD
  @ViewChild('googleBtn') googleBtn!: ElementRef<HTMLDivElement>;

  // PUBLIC PROPERTIES
  public readonly IconConstant = IconConstant;
  public readonly loggedInGoogle$ = this.googleService.loggedIn$;

  // CONSTRUCTOR
  constructor(private readonly googleService: GoogleService) {}

  // PUBLIC METHODS
  public connectGoogle(): void {
    this.googleService.auth();
  }

  public signOutGoogle(): void {
    this.googleService.signOut();
  }
}
