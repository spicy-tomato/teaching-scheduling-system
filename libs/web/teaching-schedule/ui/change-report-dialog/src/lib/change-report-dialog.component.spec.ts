import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeReportDialogComponent } from './change-report-dialog.component';

describe('ChangeReportDialogComponent', () => {
  let component: ChangeReportDialogComponent;
  let fixture: ComponentFixture<ChangeReportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeReportDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
