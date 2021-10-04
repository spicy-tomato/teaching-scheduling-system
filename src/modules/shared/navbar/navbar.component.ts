import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { tuiIconLikeLarge, tuiIconLogoutLarge, tuiIconSettingsLarge, tuiIconTooltipLarge, tuiIconUser } from '@taiga-ui/icons';

@Component({
  selector: 'tss-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
  readonly groups: {
    label?: string,
    items: {
      label?: string,
      routerLink:
      string,
      icon?: any;
    }[];
  }[] = [
      {
        items: [
          {
            label: 'Thông tin cá nhân',
            routerLink: '/components/input',
            icon: '<i class="far fa-user" style="font-size: 23px"></i>'
          },
        ],
      },
      {
        items: [
          {
            label: `Đóng góp ý kiến`,
            routerLink: '/icons',
            icon: tuiIconLikeLarge
          },
        ],
      },
      {
        label: '',
        items: [
          {
            label: `Cài đặt`,
            routerLink: '/changelog',
            icon: tuiIconSettingsLarge
          },
          {
            label: `Trợ giúp & hỗ trợ`,
            routerLink: '/changelog',
            icon: '<i class="far fa-question-circle" style="font-size: 23px"></i>'
          },
          {
            label: `Đăng xuất`,
            routerLink: '/changelog',
            icon: '<i class="far fa-sign-out" style="font-size: 23px; transform: translateX(2px);"></i>'
          },

        ],
      },
    ];

  constructor() { }

  ngOnInit(): void {
  }

}
