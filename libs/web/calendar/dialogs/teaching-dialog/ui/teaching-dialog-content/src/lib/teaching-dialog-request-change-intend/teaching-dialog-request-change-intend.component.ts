import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ControlContainer } from '@angular/forms';
import { CoreConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { fadeIn } from '@teaching-scheduling-system/core/ui/animations';

@Component({
  selector: 'tss-teaching-dialog-request-change-intend',
  templateUrl: './teaching-dialog-request-change-intend.component.html',
  styleUrls: ['./teaching-dialog-request-change-intend.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn],
})
export class TeachingDialogRequestChangeIntendComponent implements OnInit {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public readonly CoreConstant = CoreConstant;

  /** GETTERS */
  public get requestIntendControl(): FormGroup {
    return this.form.controls['requestIntend'] as FormGroup;
  }

  /** CONSTRUCTOR */
  constructor(public readonly controlContainer: ControlContainer) {}

  /** LIFECYCLE */
  public ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
  }
}
