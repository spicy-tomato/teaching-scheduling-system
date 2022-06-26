import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingDialogButtonsRightComponent } from './teaching-dialog-buttons-right.component';

describe('TeachingDialogButtonsRightComponent', () => {
  let component: TeachingDialogButtonsRightComponent;
  let fixture: ComponentFixture<TeachingDialogButtonsRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeachingDialogButtonsRightComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachingDialogButtonsRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
