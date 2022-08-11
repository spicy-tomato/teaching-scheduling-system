import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let require: any;
const Parallax = require('parallax-js');

@Component({
  selector: 'tss-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent implements AfterViewInit {
  // INPUT
  @Input() code!: number;
  @Input() message!: string;

  // VIEW CHILD
  @ViewChild('scene') scene!: ElementRef<HTMLDivElement>;

  // LIFECYCLE
  ngAfterViewInit(): void {
    new Parallax(this.scene.nativeElement, {});
  }
}
