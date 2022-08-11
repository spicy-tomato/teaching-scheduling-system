import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  // let title: Title;

  beforeEach(() => {
    const tuiDestroyServiceStub = () => ({});
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'login',
            data: {
              title: 'Đăng nhập',
            },
            loadChildren: async () =>
              (await import('@teaching-scheduling-system/web/login/feature'))
                .LoginModule,
          },
          // {
          //   path: '',
          //   children: [
          //     {
          //       path: '',
          //       pathMatch: 'full',
          //       redirectTo: 'calendar',
          //     },
          //     {
          //       path: 'calendar',
          //       data: {
          //         breadcrumb: 'Lịch biểu',
          //       },
          //     },
          //     {
          //       path: 'schedule',
          //       data: {
          //         breadcrumb: 'Lịch giảng dạy',
          //       },
          //     },
          //     {
          //       path: 'exam',
          //       data: {
          //         breadcrumb: 'Lịch thi',
          //       },
          //     },
          //     {
          //       path: 'statistic',
          //       data: {
          //         breadcrumb: 'Thống kê',
          //       },
          //     },
          //     {
          //       path: 'settings',
          //       data: {
          //         breadcrumb: 'Cài đặt',
          //       },
          //     },
          //     {
          //       path: 'feedback',
          //       data: {
          //         breadcrumb: 'Đóng góp ý kiến',
          //       },
          //     },
          //     {
          //       path: 'user-info',
          //       data: {
          //         breadcrumb: 'Thông tin cá nhân',
          //       },
          //     },
          //   ],
          // },
          {
            path: 'maintenance',
            data: {
              title: '🛠️ Ứng dụng đang được bảo trì 🛠️',
            },
            loadChildren: async () =>
              (
                await import(
                  '@teaching-scheduling-system/web/error/feature/maintenance'
                )
              ).MaintenanceModule,
          },
          {
            path: 'reset-password',
            loadChildren: async () =>
              (
                await import(
                  '@teaching-scheduling-system/web/reset-password/feature/shell'
                )
              ).ShellModule,
          },
          {
            path: '403',
            data: {
              title: 'Không có quyền truy cập',
            },
            loadChildren: async () =>
              (
                await import(
                  '@teaching-scheduling-system/web/error/feature/forbidden'
                )
              ).ForbiddenModule,
          },
          {
            path: '**',
            data: {
              title: 'Không tìm thấy trang',
            },
            loadChildren: async () =>
              (
                await import(
                  '@teaching-scheduling-system/web/error/feature/not-found'
                )
              ).NotFoundModule,
          },
        ]),
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AppComponent],
      providers: [
        Title,
        { provide: TuiDestroyService, useFactory: tuiDestroyServiceStub },
      ],
    });

    router = TestBed.inject(Router);
    // title = TestBed.inject(Title);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    router.initialNavigation();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  // TODO: Test ngOnInit
  // describe('ngOnInit', () => {
  //   it('makes expected calls', () => {
  //     const titleStub: Title = fixture.debugElement.injector.get(Title);
  //     const events = new Subject<Event>();
  //     jest.spyOn(component, 'foo');
  //     jest.spyOn(titleStub, 'setTitle');
  //     jest.spyOn(router.events, 'pipe').mockReturnValue(events);

  //     component.ngOnInit();
  //     events.next(new NavigationEnd(1, '', '/login'))
  //     // router.navigate(['']);
  //     // router.navigate(['/login']);
  //     // expect(component.foo).toHaveBeenCalled();
  //     expect(title.getTitle()).toBe('Hehe');
  //     // expect(titleStub.setTitle).toHaveBeenCalled();
  //   });
  // });
});
