import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
} from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { PermissionConstant, TableConstant } from '@shared/constants';
import { EApiStatus } from '@shared/enums';
import {
  ChangeSchedule,
  ChangeScheduleOptions,
  ChangeScheduleStatus,
} from '@shared/models';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';
import * as fromRequests from '../state';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import {
  AlignmentType,
  Document,
  Packer,
  PageOrientation,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  VerticalAlign,
  SectionType,
  ColumnBreak,
} from 'docx';
import { saveAs } from 'file-saver';
import { ArrayHelper, DateHelper, StringHelper } from '@shared/helpers';
import { IconConstant } from '@shared/constants/components/icon.constant';
import { DatePipe } from '@angular/common';
import { TokenService } from '@services/core/token.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tss-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TokenService.DATE_PIPE_TOKEN,
      useClass: DatePipe,
    },
  ],
})
export class RequestsListComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public data$: Observable<ChangeSchedule[]>;
  public status$: Observable<ChangeScheduleStatus>;
  public page$: Observable<number>;
  public options$: Observable<ChangeScheduleOptions>;
  public permissions$: Observable<number[]>;

  public personal: boolean;
  public columns: string[] = [];

  public readonly EApiStatus = EApiStatus;
  public readonly itemsPerPage = TableConstant.REQUESTS_LIST_ITEMS_PER_PAGE;
  public readonly IconConstant = IconConstant;
  public readonly PermissionConstant = PermissionConstant;
  public readonly initialColumns = [
    'index',
    'teacher',
    'moduleClass',
    'oldDate',
    'newDate',
    'oldShift',
    'newShift',
    'oldRoom',
    'newRoom',
    'reason',
    'timeRequest',
    'timeAccept',
    'timeSetRoom',
    'status',
    'actions',
  ];

  /** CONSTRUCTOR */
  constructor(
    private readonly tokenService: TokenService,
    @Inject(Injector) private injector: Injector,
    store: Store<fromRequests.RequestsState>,
    appShellStore: Store<fromAppShell.AppShellState>,
    route: ActivatedRoute
  ) {
    super();

    this.options$ = store
      .select(fromRequests.selectOptions)
      .pipe(takeUntil(this.destroy$));
    this.data$ = store
      .select(fromRequests.selectChangeSchedules)
      .pipe(takeUntil(this.destroy$));
    this.status$ = store
      .select(fromRequests.selectStatus)
      .pipe(takeUntil(this.destroy$));
    this.page$ = store
      .select(fromRequests.selectPage)
      .pipe(takeUntil(this.destroy$));
    this.permissions$ = appShellStore
      .select(fromAppShell.selectPermission)
      .pipe(takeUntil(this.destroy$));

    this.personal = route.snapshot.data['personal'] as boolean;

    if (this.personal) {
      this.configureColumns();
    }

    this.handleOptionsChange();
  }

  /** PUBLIC METHODS */
  public onExport(schedule: ChangeSchedule, timeRequest: string): void {
    const document = this.generateFile(schedule);
    this.export(document, schedule.teacher, timeRequest);
  }

  /** PRIVATE METHODS */
  private configureColumns(): void {
    ArrayHelper.removeAt(this.initialColumns, 1);
  }

  private handleOptionsChange(): void {
    this.options$
      .pipe(
        map((option) => option.showReason),
        distinctUntilChanged(),
        tap((showReason) => {
          if (showReason) {
            this.columns = this.initialColumns;
          } else {
            this.columns = this.initialColumns.filter((x) => x !== 'reason');
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private getDatePipe(): DatePipe {
    return this.injector.get(this.tokenService.getToken<DatePipe>('datePipe'));
  }

  private generateFile(schedule: ChangeSchedule): Document {
    const alignment = AlignmentType.CENTER;
    const today = new Date();
    const page = {
      size: {
        orientation: PageOrientation.LANDSCAPE,
      },
    };

    return new Document({
      styles: {
        default: {
          document: {
            run: {
              size: 26,
            },
            paragraph: {
              spacing: {
                after: 160,
                line: 260,
              },
            },
          },
        },
      },
      sections: [
        {
          properties: {
            page,
          },
          children: [
            new Paragraph({
              alignment,
              spacing: {
                after: 0,
              },
              children: [
                new TextRun({
                  text: 'Cộng hòa xã hội chủ nghĩa Việt Nam',
                  allCaps: true,
                }),
                new TextRun({ break: 1 }),
                new TextRun({
                  text: 'Độc lập – Tự do – Hạnh phúc',
                  bold: true,
                }),
                new TextRun({ break: 1 }),
                new TextRun({
                  text: '-----------------------------------',
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              alignment,
              spacing: {
                before: 320,
                after: 320,
              },
              children: [
                new TextRun({
                  text: 'Giấy xin thay đổi thời khóa biểu hoặc dạy bù',
                  bold: true,
                  allCaps: true,
                }),
              ],
            }),
            new Paragraph({
              indent: {
                firstLine: '0.5in',
              },
              spacing: {
                line: 375,
              },
              children: [
                new TextRun({
                  text: 'Kính gửi: ',
                  italics: true,
                }),
                new TextRun({
                  text: 'Ban Quản lý Giảng đường',
                }),
                new TextRun({ break: 1 }),
                new TextRun({
                  text: `Họ và tên giảng viên: ${schedule.teacher}`,
                }),
                new TextRun({ break: 1 }),
                new TextRun({
                  text: `Bộ môn: ${schedule.teacher}`,
                }),
                new TextRun({ break: 1 }),
                new TextRun({
                  text: `Lý do thay đổi: ${schedule.teacher}`,
                }),
              ],
            }),
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      rowSpan: 2,
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          text: 'STT',
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      rowSpan: 2,
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          text: 'Lớp học phần',
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      columnSpan: 3,
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing: {
                            before: 120,
                            after: 120,
                          },
                          text: 'Lịch cũ',
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      columnSpan: 3,
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          text: 'Lịch mới',
                          alignment,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing: {
                            before: 120,
                            after: 120,
                          },
                          text: 'Thời gian',
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          text: 'Tiết',
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          text: 'Phòng',
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          text: 'Thời gian',
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          text: 'Tiết',
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          text: 'Phòng',
                          alignment,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          text: '1',
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing: {
                            before: 160,
                          },
                          indent: {
                            firstLine: '0.1in',
                          },
                          text: schedule.moduleClassName,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          text:
                            this.getDatePipe().transform(
                              schedule.oldSchedule.date,
                              'dd-MM-Y'
                            ) ?? '',
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          text: schedule.oldSchedule.shift,
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          text: schedule.oldSchedule.room,
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          text:
                            this.getDatePipe().transform(
                              schedule.newSchedule.date,
                              'dd-MM-Y'
                            ) ?? '',
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          text: schedule.newSchedule.shift,
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          text: schedule.newSchedule.room,
                          alignment,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph({
              spacing: {
                before: 280,
              },
              indent: {
                firstLine: '0.5in',
              },
              children: [
                new TextRun({
                  text: 'Trân trọng cảm ơn!',
                  italics: true,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: {
                before: 160,
                after: 0,
              },
              children: [
                new TextRun({
                  text: `Hà Nội, ngày ${DateHelper.beautifyDay(
                    today.getDate()
                  )} tháng ${DateHelper.beautifyDay(
                    today.getMonth() + 1
                  )} năm ${today.getFullYear()}`,
                  italics: true,
                }),
              ],
            }),
          ],
        },
        {
          properties: {
            page,
            column: {
              count: 3,
              equalWidth: true,
            },
            type: SectionType.CONTINUOUS,
          },
          children: [
            new Paragraph({
              alignment,
              spacing: {
                before: 280,
              },
              children: [
                new TextRun({
                  text: 'Ý kiến của bộ môn',
                }),
                new ColumnBreak(),
                new TextRun({
                  text: 'Ý kiến của Điều độ',
                }),
                new ColumnBreak(),
                new TextRun({
                  text: 'Giảng viên',
                }),
                new TextRun({ break: 5 }),
                new TextRun({
                  text: schedule.teacher,
                }),
              ],
            }),
          ],
        },
      ],
    });
  }

  private export(doc: Document, name: string, timeRequest: string): void {
    const mimeType =
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    void Packer.toBlob(doc).then((blob) => {
      const docBlob = blob.slice(0, blob.size, mimeType);
      const commonName = 'Giay-xin-thay-doi-gio-giang';
      const teacherName = `${commonName}_${StringHelper.toLatinText(name)
        .split(' ')
        .join('-')}`;
      saveAs(docBlob, `${commonName}_${teacherName}_${timeRequest}.docx`);
    });
  }
}
