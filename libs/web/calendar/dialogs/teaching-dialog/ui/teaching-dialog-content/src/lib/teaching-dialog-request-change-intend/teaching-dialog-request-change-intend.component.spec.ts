import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingDialogRequestChangeIntendComponent } from './teaching-dialog-request-change-intend.component';

describe('TeachingDialogRequestChangeIntendComponent', () => {
  let component: TeachingDialogRequestChangeIntendComponent;
  let fixture: ComponentFixture<TeachingDialogRequestChangeIntendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeachingDialogRequestChangeIntendComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      TeachingDialogRequestChangeIntendComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
