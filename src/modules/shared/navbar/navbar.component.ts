import { ChangeDetectionStrategy, Component } from '@angular/core';
import { tuiIconLikeLarge, tuiIconSettingsLarge } from '@taiga-ui/icons';

@Component({
  selector: 'tss-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  readonly groups: {
    label?: string,
    items: {
      label?: string,
      routerLink:
      string,
      icon?: string;
    }[];
  }[] = [
      {
        items: [
          {
            label: 'Thông tin cá nhân',
            routerLink: '',
            icon: '<i class="far fa-user" style="font-size: 23px"></i>'
          },
        ],
      },
      {
        items: [
          {
            label: `Đóng góp ý kiến`,
            routerLink: '',
            icon: tuiIconLikeLarge
          },
        ],
      },
      {
        label: '',
        items: [
          {
            label: `Cài đặt`,
            routerLink: '',
            icon: tuiIconSettingsLarge
          },
          {
            label: `Trợ giúp & hỗ trợ`,
            routerLink: '',
            icon: '<i class="far fa-question-circle" style="font-size: 23px"></i>'
          },
          {
            label: `Đăng xuất`,
            routerLink: '/login',
            icon: '<i class="far fa-sign-out" style="font-size: 23px; transform: translateX(2px);"></i>'
          },

        ],
      },
    ];
}
