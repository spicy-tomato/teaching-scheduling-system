import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarMenuComponent } from './calendar-menu.component';

describe('CalendarMenuComponent', () => {
  let component: CalendarMenuComponent;
  let fixture: ComponentFixture<CalendarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
