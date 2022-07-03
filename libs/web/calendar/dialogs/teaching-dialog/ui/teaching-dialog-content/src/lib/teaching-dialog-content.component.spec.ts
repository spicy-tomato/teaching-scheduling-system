import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingDialogContentComponent } from './teaching-dialog-content.component';

describe('TeachingDialogContentComponent', () => {
  let component: TeachingDialogContentComponent;
  let fixture: ComponentFixture<TeachingDialogContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeachingDialogContentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachingDialogContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
