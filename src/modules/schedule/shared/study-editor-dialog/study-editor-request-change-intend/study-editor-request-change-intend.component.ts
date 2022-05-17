import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, ControlContainer } from '@angular/forms';
import { fadeIn } from '@shared/animations';
import { CoreConstant } from '@shared/constants';

@Component({
  selector: 'tss-study-editor-request-change-intend',
  templateUrl: './study-editor-request-change-intend.component.html',
  styleUrls: ['./study-editor-request-change-intend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn],
})
export class StudyEditorRequestChangeIntendComponent implements OnInit {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public readonly CoreConstant = CoreConstant;

  /** GETTERS */
  public get requestIntendControl(): FormGroup {
    return this.form.controls['requestIntend'] as FormGroup;
  }

  /** CONSTRUCTOR */
  constructor(public readonly controlContainer: ControlContainer) {}

  /** LIFE CYCLE */
  public ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
  }
}
