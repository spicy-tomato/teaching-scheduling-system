import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { DeviceHelper } from '@teaching-scheduling-system/core/utils/helpers';

@Directive({
  selector: '[tssTouchScreenOr]',
})
export class TouchScreenOrDirective {
  /** SETTER */
  // @Input() public set tssPermission(_: undefined) {
  //   this._tssPermission = permissions;
  //   this.bind$.next();
  // }

  @Input() public set tssTouchScreenOrElse(templateRef: TemplateRef<unknown>) {
    if (!DeviceHelper.isTouchDevice()) {
      this.viewContainerRef.clear();
      this.viewContainerRef.createEmbeddedView(templateRef);
    }
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly thenTemplateRef: TemplateRef<unknown>,
    private viewContainerRef: ViewContainerRef
  ) {}
}
