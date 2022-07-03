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
  /** INPUT */
  @Input() public code!: number;
  @Input() public message!: string;

  /** VIEW CHILD */
  @ViewChild('scene') public scene!: ElementRef<HTMLDivElement>;

  /** LIFE CYCLES */
  public ngAfterViewInit(): void {
    new Parallax(this.scene.nativeElement, {});
  }
}
