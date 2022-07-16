import {
  Directive,
  EmbeddedViewRef,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';

@Directive({
  selector: '[tssRecreateViewKey]',
})
export class RecreateViewKeyDirective {
  /** INPUT */
  @Input('tssRecreateViewKey') public set key(value: unknown) {
    if (value !== this._key) {
      if (this.viewRef) {
        this.viewContainer.clear();
      }
      this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
      this._key = value;
    }
  }

  /** PRIVATE PROPERTIES */
  private viewRef: Nullable<EmbeddedViewRef<unknown>> = null;
  private _key: unknown = null;

  /** CONSTRUCTOR */
  constructor(
    private readonly templateRef: TemplateRef<unknown>,
    private readonly viewContainer: ViewContainerRef
  ) {}
}
