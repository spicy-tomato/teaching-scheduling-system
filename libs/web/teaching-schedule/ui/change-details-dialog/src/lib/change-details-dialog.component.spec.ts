import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDetailsDialogComponent } from './change-details-dialog.component';

describe('ChangeDetailsDialogComponent', () => {
  let component: ChangeDetailsDialogComponent;
  let fixture: ComponentFixture<ChangeDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeDetailsDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
