import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tss-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  items: { name: string, subItems?: string[]; }[] = [
    {
      name: 'Học phần',
      subItems: [
        'Thông tin học phần',
        'Thêm học phần'
      ]
    },
    {
      name: 'Giảng viên',
      subItems: [
        'Thông tin giảng viên',
        'Thêm giảng viên'
      ]
    },
    {
      name: 'Lớp học phần',
      subItems: [
        'Thông tin lớp học phần'
      ]
    },
    {
      name: 'Lịch giảng dạy',
      subItems: [
        'Thông tin giờ giảng',
        'Yêu cầu thay đổi'
      ]
    },
    {
      name: 'Phân giảng',
      subItems: [
        'Lớp phân giảng',
        'Danh sách phân giảng'
      ]
    },
    {
      name: 'Nhập file',
      subItems: [
        'Thêm giảng viên',
        'Thêm lớp học phần'
      ]
    },
    {
      name: 'Thống kê'
    },
    {
      name: 'Học phần',
      subItems: [
        'Thông tin học phần',
        'Thêm học phần'
      ]
    },
    {
      name: 'Học phần',
      subItems: [
        'Thông tin học phần',
        'Thêm học phần'
      ]
    },
    {
      name: 'Học phần',
      subItems: [
        'Thông tin học phần',
        'Thêm học phần'
      ]
    },
  ];
}
