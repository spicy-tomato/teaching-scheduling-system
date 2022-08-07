import { Injector } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TuiMobileCalendarDialogComponent } from '@taiga-ui/addon-mobile';
import { tuiReplayedValueChangesFrom } from '@taiga-ui/cdk';
import { TUI_CALENDAR_DATA_STREAM, TUI_DONE_WORD } from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { of } from 'rxjs';

export class ComponentHelper {
  static getMobileDialogContent(
    injector: Injector,
    control: AbstractControl
  ): PolymorpheusComponent<TuiMobileCalendarDialogComponent, object> {
    return new PolymorpheusComponent(
      TuiMobileCalendarDialogComponent,
      Injector.create({
        providers: [
          {
            provide: TUI_CALENDAR_DATA_STREAM,
            useValue: tuiReplayedValueChangesFrom(control),
          },
          {
            provide: TUI_DONE_WORD,
            useValue: of('Xong'),
          },
        ],
        parent: injector,
      })
    );
  }
}
