import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingDialogRequestChangeComponent } from './teaching-dialog-request-change.component';

describe('TeachingDialogRequestChangeComponent', () => {
  let component: TeachingDialogRequestChangeComponent;
  let fixture: ComponentFixture<TeachingDialogRequestChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeachingDialogRequestChangeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachingDialogRequestChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
