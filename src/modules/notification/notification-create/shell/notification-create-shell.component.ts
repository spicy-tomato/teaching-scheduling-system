import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'tss-notification-create-shell',
  templateUrl: './notification-create-shell.component.html',
  styleUrls: ['./notification-create-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationCreateShellComponent {
  public form = this.fb.group({
    content: [],
    receipt: []
  });

  constructor(private fb: FormBuilder) { }

  public onSubmit(): void {
    console.log(this.form.value);
  }
}
