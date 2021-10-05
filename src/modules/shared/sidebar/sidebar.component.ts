import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tss-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  items: {
    name: string,
    icon?: string,
    subItems?: string[];
  }[] = [
      {
        name: 'Học phần',
        icon: 'far fa-book',
        subItems: [
          'Thông tin học phần',
          'Thêm học phần'
        ]
      },
      {
        name: 'Giảng viên',
        icon: 'far fa-chalkboard-teacher',
        subItems: [
          'Thông tin giảng viên',
          'Thêm giảng viên'
        ]
      },
      {
        name: 'Lớp học phần',
        icon: 'far fa-users-class',
        subItems: [
          'Thông tin lớp học phần'
        ]
      },
      {
        name: 'Lịch giảng dạy',
        icon: 'far fa-calendar-alt',
        subItems: [
          'Thông tin giờ giảng',
          'Yêu cầu thay đổi'
        ]
      },
      {
        name: 'Phân giảng',
        icon: 'far fa-pencil-paintbrush',
        subItems: [
          'Lớp phân giảng',
          'Danh sách phân giảng'
        ]
      },
      {
        name: 'Nhập file',
        icon: 'far fa-file-import',
        subItems: [
          'Thêm giảng viên',
          'Thêm lớp học phần'
        ]
      },
      {
        name: 'Thống kê',
        icon: 'far fa-chart-pie'
      }
    ];
}
