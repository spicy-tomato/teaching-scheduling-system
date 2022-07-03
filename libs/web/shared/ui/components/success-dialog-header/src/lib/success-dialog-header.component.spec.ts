import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessDialogHeaderComponent } from './success-dialog-header.component';

describe('SuccessDialogHeaderComponent', () => {
  let component: SuccessDialogHeaderComponent;
  let fixture: ComponentFixture<SuccessDialogHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuccessDialogHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessDialogHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
