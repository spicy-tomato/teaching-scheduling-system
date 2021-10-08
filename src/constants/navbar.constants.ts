import { tuiIconLikeLarge, tuiIconSettingsLarge } from "@taiga-ui/icons";

export class NavbarConstants {
  public static items = [
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
