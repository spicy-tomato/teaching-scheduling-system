import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Nullable } from '@shared/models';

@Directive({
  selector: '[tssRecreateViewKey]',
})
export class RecreateViewKeyDirective implements OnChanges {
  /** INPUT */
  @Input('tssRecreateViewKey') public key: unknown;

  /** PRIVATE PROPERTIES */
  private viewRef: Nullable<EmbeddedViewRef<unknown>> = null;

  /** CONSTRUCTOR */
  constructor(
    private readonly templateRef: TemplateRef<unknown>,
    private readonly viewContainer: ViewContainerRef
  ) {}

  /** LIFE CYCLE */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.key) {
      if (this.viewRef) {
        this.destroyView();
      }
      this.createView();
    }
  }

  /** PRIVATE METHODS */
  private createView(): void {
    this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
  }

  private destroyView(): void {
    this.viewRef?.destroy();
    this.viewRef = null;
  }
}
