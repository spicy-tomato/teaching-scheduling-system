import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDenyDialogComponent } from './change-deny-dialog.component';

describe('ChangeDenyDialogComponent', () => {
  let component: ChangeDenyDialogComponent;
  let fixture: ComponentFixture<ChangeDenyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeDenyDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDenyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
