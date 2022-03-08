import { DatePipe } from '@angular/common';
import { Inject, Injectable, Injector } from '@angular/core';
import { RoleConstant } from '@shared/constants';
import { FileType } from '@shared/enums';
import { DateHelper } from '@shared/helpers';
import { ChangeSchedule, Teacher } from '@shared/models';
import { TuiDayRange } from '@taiga-ui/cdk';
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
  BorderStyle,
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
    document: Document;
    name: string;
    mimeType: FileType;
  }): void {
    void Packer.toBlob(settings.document).then((blob) => {
      const docBlob = blob.slice(0, blob.size, settings.mimeType);
      saveAs(docBlob, settings.name);
    });
  }

  public exportChangeScheduleRequestForTeacher(
    schedule: ChangeSchedule,
    teacherName: string,
    department: string
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
                  bold: true,
                  allCaps: true,
                }),
                new TextRun({
                  break: 1,
                  text: 'Độc lập – Tự do – Hạnh phúc',
                  bold: true,
                }),
                new TextRun({
                  break: 1,
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
                new TextRun({
                  break: 1,
                  text: `Họ và tên giảng viên: ${teacherName}`,
                }),
                new TextRun({
                  break: 1,
                  text: `Bộ môn: ${department}`,
                }),
                new TextRun({
                  break: 1,
                  text: `Lý do thay đổi: ${schedule.reason}`,
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
                            ) ?? schedule.oldSchedule.date,
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
                            ) ?? schedule.newSchedule.date,
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
                new TextRun({
                  break: 5,
                  text: teacherName,
                }),
              ],
            }),
          ],
        },
      ],
    });
  }

  public exportChangeScheduleRequestForRoomManager(
    schedule: ChangeSchedule,
    department: string,
    faculty: string
  ): Document {
    const alignment = AlignmentType.CENTER;
    const today = new Date();
    const spacing = {
      after: 0,
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
          children: [
            new Paragraph({
              alignment,
              spacing,
              children: [
                new TextRun({
                  text: 'Cộng hòa xã hội chủ nghĩa Việt Nam',
                  bold: true,
                  allCaps: true,
                }),
                new TextRun({
                  break: 1,
                  text: 'Độc lập – Tự do – Hạnh phúc',
                  bold: true,
                }),
                new TextRun({
                  break: 1,
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
                  text: 'Giấy đăng ký phòng học',
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
                  text: 'Điều độ - Ban Quản lý Giảng đường',
                }),
                new TextRun({
                  break: 2,
                  text: `Họ và tên giảng viên: ${schedule.teacher.name}`,
                }),
                new TextRun({
                  break: 1,
                  text: `Bộ môn: ${department}`,
                }),
                new TextRun({
                  break: 1,
                  text: `Khoa: ${faculty}`,
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
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'STT',
                              bold: true,
                            }),
                          ],
                          spacing,
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing,
                          children: [
                            new TextRun({
                              text: 'Ngày sử dụng',
                              bold: true,
                            }),
                          ],
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'Ca',
                              bold: true,
                            }),
                          ],
                          spacing: {
                            before: 120,
                            after: 120,
                          },
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'Sĩ số',
                              bold: true,
                            }),
                          ],
                          spacing,
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'Lý do sử dụng',
                              bold: true,
                            }),
                          ],
                          spacing,
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'Phòng học',
                              bold: true,
                            }),
                          ],
                          spacing,
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'Phòng nước',
                              bold: true,
                            }),
                          ],
                          spacing,
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
                          children: [
                            new TextRun({
                              text: '(1)',
                              bold: true,
                            }),
                          ],
                          spacing,
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [new Paragraph({ spacing, alignment })],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: '(3)',
                              bold: true,
                            }),
                          ],
                          spacing,
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: '(4)',
                              bold: true,
                            }),
                          ],
                          spacing,
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: '(5)',
                              bold: true,
                            }),
                          ],
                          spacing,
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: '(6)',
                              bold: true,
                            }),
                          ],
                          spacing,
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: '(7)',
                              bold: true,
                            }),
                          ],
                          spacing,
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
                        new Paragraph({ spacing, text: '1', alignment }),
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
                          text: schedule.newSchedule.date,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing,
                          text: schedule.newSchedule.shift,
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing,
                          text: '50',
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          indent: {
                            firstLine: '0.1in',
                          },
                          spacing,
                          text: schedule.reason,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing,
                          text: schedule.newSchedule.room,
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          spacing,
                          text: 'Phòng nước',
                          alignment,
                        }),
                      ],
                    }),
                  ],
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
                  break: 2,
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
            column: {
              count: 2,
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
                  text: 'Người đăng ký phòng',
                }),
                new TextRun({
                  break: 5,
                  text: schedule.teacher.name,
                }),
                new ColumnBreak(),
                new TextRun({
                  text: 'Xác nhận của Điều độ',
                }),
                new TextRun({
                  break: 5,
                  text: 'Khuất Minh Phúc',
                }),
              ],
            }),
          ],
        },
        {
          properties: {
            type: SectionType.CONTINUOUS,
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  break: 2,
                  text: 'Lưu ý',
                  bold: true,
                  underline: {},
                  italics: true,
                }),
                new TextRun({
                  break: 1,
                  text: 'GV gửi giấy theo cột (7) đến "Phòng nước" ít nhất trước 01 ngày',
                  italics: true,
                }),
              ],
            }),
          ],
        },
      ],
    });
  }

  public exportChangeScheduleStatistic(
    schedules: ChangeSchedule[],
    teacher: Teacher,
    range: TuiDayRange,
    rangeOptions: { sameMonth: boolean; inOneYear: boolean }
  ): Document {
    const rangeText = rangeOptions.sameMonth
      ? `tháng ${DateHelper.beautifyDay(range.from.month + 1)}/${
          range.from.year
        }`
      : rangeOptions.inOneYear
      ? `năm ${range.from.year}`
      : `từ ${DateHelper.beautifyDay(range.from.day)}/${DateHelper.beautifyDay(
          range.from.month + 1
        )}/${range.from.year} đến ${DateHelper.beautifyDay(
          range.to.day
        )}/${DateHelper.beautifyDay(range.to.month + 1)}/${range.to.year}`;
    const today = new Date();
    const alignment = AlignmentType.CENTER;
    const verticalAlign = VerticalAlign.CENTER;
    const page = {
      margin: {
        top: '0.7in',
        right: '0.6in',
        bottom: '0.7in',
        left: '0.6in',
      },
    };
    const width = {
      size: 18,
      type: WidthType.PERCENTAGE,
    };

    return new Document({
      styles: {
        default: {
          document: {
            run: {
              size: 24,
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
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              borders: {
                insideHorizontal: {
                  style: BorderStyle.NONE,
                },
                insideVertical: {
                  style: BorderStyle.NONE,
                },
                top: {
                  style: BorderStyle.NONE,
                },
                right: {
                  style: BorderStyle.NONE,
                },
                bottom: {
                  style: BorderStyle.NONE,
                },
                left: {
                  style: BorderStyle.NONE,
                },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      verticalAlign,
                      width: {
                        size: 45,
                        type: WidthType.PERCENTAGE,
                      },
                      children: [
                        new Paragraph({
                          alignment,
                          children: [
                            new TextRun({
                              text: `Khoa ${teacher.faculty.name}`,
                            }),
                            new TextRun({
                              break: 1,
                              text: `Bộ môn ${teacher.department.name}`,
                              bold: true,
                            }),
                            new TextRun({
                              break: 1,
                              text: '_______________________',
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign,
                      width: {
                        size: 5,
                        type: WidthType.PERCENTAGE,
                      },
                      children: [],
                    }),
                    new TableCell({
                      verticalAlign,
                      width: {
                        size: 50,
                        type: WidthType.PERCENTAGE,
                      },
                      children: [
                        new Paragraph({
                          alignment,
                          children: [
                            new TextRun({
                              text: 'Cộng hòa xã hội chủ nghĩa Việt Nam',
                              allCaps: true,
                            }),
                            new TextRun({
                              break: 1,
                              text: 'Độc lập – Tự do – Hạnh phúc',
                            }),
                            new TextRun({
                              break: 1,
                              text: '_______________________',
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.END,
              spacing: {
                before: 320,
                after: 320,
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
            new Paragraph({
              alignment,
              spacing: {
                before: 320,
                after: 320,
              },
              children: [
                new TextRun({
                  text: 'Tờ trình',
                  allCaps: true,
                  size: 34,
                }),
                new TextRun({
                  break: 1,
                  italics: true,
                  text: `(V/v thay đổi lịch dạy ${rangeText})`,
                  size: 26,
                }),
              ],
            }),
            new Paragraph({
              spacing: {
                line: 250,
              },
              children: [
                new TextRun({
                  text: 'Kính gửi:',
                  size: 26,
                  bold: true,
                  underline: {},
                }),
                new TextRun({
                  text: ' Phòng Thanh tra Pháp chế',
                  size: 26,
                  bold: true,
                }),
                new TextRun({
                  break: 2,
                  text: `Bộ môn ${teacher.department.name} xin gửi tới phòng Thanh tra Pháp chế thay đổi lịch giảng dạy trong bộ môn ${rangeText}:`,
                }),
                new TextRun({ break: 1 }),
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
                      margins: {
                        top: 100,
                        bottom: 100,
                      },
                      verticalAlign,
                      width: {
                        size: 6,
                        type: WidthType.PERCENTAGE,
                      },
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          children: [
                            new TextRun({
                              text: 'STT',
                              bold: true,
                            }),
                          ],
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign,
                      width,
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          children: [
                            new TextRun({
                              text: 'Ngày, tiết, phòng',
                              bold: true,
                            }),
                          ],
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign,
                      width,
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          children: [
                            new TextRun({
                              text: 'Lớp - Môn',
                              bold: true,
                            }),
                          ],
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign,
                      width: {
                        size: 17,
                        type: WidthType.PERCENTAGE,
                      },
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          children: [
                            new TextRun({
                              text: 'Giáo viên',
                              bold: true,
                            }),
                          ],
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign,
                      width,
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          children: [
                            new TextRun({
                              text: 'Lý do',
                              bold: true,
                            }),
                          ],
                          alignment,
                        }),
                      ],
                    }),
                    new TableCell({
                      verticalAlign,
                      width: {
                        size: 22,
                        type: WidthType.PERCENTAGE,
                      },
                      children: [
                        new Paragraph({
                          spacing: {
                            after: 0,
                          },
                          children: [
                            new TextRun({
                              text: 'Ngày, Phòng dạy bù',
                              bold: true,
                            }),
                          ],
                          alignment,
                        }),
                      ],
                    }),
                  ],
                }),
                ...schedules.map(
                  (schedule, row) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          verticalAlign,
                          children: [
                            new Paragraph({
                              spacing: {
                                after: 0,
                              },
                              text: `${row + 1}`,
                              alignment,
                            }),
                          ],
                        }),
                        new TableCell({
                          verticalAlign,
                          children: [
                            new Paragraph({
                              spacing: {
                                after: 0,
                              },
                              text: `${
                                this.datePipe.transform(
                                  schedule.oldSchedule.date,
                                  'dd/MM/Y'
                                ) ?? schedule.oldSchedule.date
                              }, ca ${schedule.oldSchedule.shift}, ${
                                schedule.oldSchedule.room
                              }`,
                              alignment,
                            }),
                          ],
                        }),
                        new TableCell({
                          verticalAlign,
                          children: [
                            new Paragraph({
                              spacing: {
                                after: 0,
                              },
                              text: schedule.moduleClassName,
                              alignment,
                            }),
                          ],
                        }),
                        new TableCell({
                          verticalAlign,
                          children: [
                            new Paragraph({
                              spacing: {
                                after: 0,
                              },
                              text: schedule.teacher.name,
                              alignment,
                            }),
                          ],
                        }),
                        new TableCell({
                          verticalAlign,
                          children: [
                            new Paragraph({
                              spacing: {
                                after: 0,
                              },
                              text: schedule.reason,
                              alignment,
                            }),
                          ],
                        }),
                        new TableCell({
                          verticalAlign,
                          children: [
                            new Paragraph({
                              spacing: {
                                after: 0,
                              },
                              text: `${
                                this.datePipe.transform(
                                  schedule.oldSchedule.date,
                                  'dd/MM/Y'
                                ) ?? schedule.oldSchedule.date
                              }, ca ${schedule.newSchedule.shift}, ${
                                schedule.newSchedule.room
                              }`,
                              alignment,
                            }),
                          ],
                        }),
                      ],
                    })
                ),
              ],
            }),
            new Paragraph({
              spacing: {
                before: 280,
              },
              children: [
                new TextRun({
                  text: 'Kính mong phòng Thanh tra Pháp chế cập nhật giúp!',
                }),
                new TextRun({
                  break: 1,
                  text: 'Xin trân trọng cảm ơn!',
                }),
              ],
            }),
          ],
        },
        {
          properties: {
            column: {
              count: 2,
              equalWidth: true,
            },
            page,
            type: SectionType.CONTINUOUS,
          },
          children: [
            new Paragraph({
              alignment,
              spacing: {
                before: 280,
              },
              children: [
                new ColumnBreak(),
                new TextRun({
                  text:
                    teacher.idRole === RoleConstant.DEPARTMENT_HEAD
                      ? 'Trưởng bộ môn'
                      : teacher.idRole === RoleConstant.DEPARTMENT_DEPUTY_HEAD
                      ? 'P. Trưởng bộ môn'
                      : 'Người làm đơn',
                }),
                new TextRun({
                  break: 5,
                  text: teacher.name,
                }),
              ],
            }),
          ],
        },
      ],
    });
  }
}
