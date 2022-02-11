import { DatePipe } from '@angular/common';
import { Inject, Injectable, Injector } from '@angular/core';
import { DateHelper } from '@shared/helpers';
import { ChangeSchedule } from '@shared/models';
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
import { TokenService } from './core/token.service';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  /** PRIVATE PROPERTIES */
  private readonly datePipe: DatePipe;

  /** CONSTRUCTOR */
  constructor(
    private readonly tokenService: TokenService,
    @Inject(Injector) injector: Injector
  ) {
    this.datePipe = injector.get(
      this.tokenService.getToken<DatePipe>('datePipe')
    );
  }

  /** PUBLIC METHODS */
  public exportBlob(settings: {
    doc: Document;
    name: string;
    mimeType: string;
  }): void {
    void Packer.toBlob(settings.doc).then((blob) => {
      const docBlob = blob.slice(0, blob.size, settings.mimeType);
      saveAs(docBlob, settings.name);
    });
  }

  public exportChangeScheduleRequestForTeacher(
    schedule: ChangeSchedule
  ): Document {
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
                            this.datePipe.transform(
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
                            this.datePipe.transform(
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
}
