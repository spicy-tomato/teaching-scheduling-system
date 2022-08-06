import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { DeviceHelper } from '@teaching-scheduling-system/core/utils/helpers';

@Directive({
  selector: '[tssTouchScreen]',
})
export class TouchScreenDirective {
  /** PRIVATE PROPERTIES */
  private _tssTouchScreen!: boolean;
  private hadElse = false;

  /** SETTER */
  @Input() set tssTouchScreen(_: null) {
    this._tssTouchScreen = true;
    this.updateView();
  }

  @Input() set tssTouchScreenElse(templateRef: TemplateRef<unknown>) {
    this.hadElse = true;
    this.elseThenTemplateRef = templateRef;
    this.updateView();
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly thenTemplateRef: TemplateRef<unknown>,
    private readonly viewContainerRef: ViewContainerRef,
    private elseThenTemplateRef: TemplateRef<unknown>
  ) {}

  private updateView(): void {
    this.viewContainerRef.clear();
    if (this._tssTouchScreen && DeviceHelper.isTouchDevice()) {
      this.viewContainerRef.createEmbeddedView(this.thenTemplateRef);
    } else if (this.hadElse) {
      this.viewContainerRef.createEmbeddedView(this.elseThenTemplateRef);
    }
  }
}
