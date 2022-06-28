import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeScheduleComponent } from './change-schedule.component';

describe('ChangeScheduleComponent', () => {
  let component: ChangeScheduleComponent;
  let fixture: ComponentFixture<ChangeScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeScheduleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
