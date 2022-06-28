import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingDialogButtonsLeftComponent } from './teaching-dialog-buttons-left.component';

describe('TeachingDialogButtonsLeftComponent', () => {
  let component: TeachingDialogButtonsLeftComponent;
  let fixture: ComponentFixture<TeachingDialogButtonsLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeachingDialogButtonsLeftComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachingDialogButtonsLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
