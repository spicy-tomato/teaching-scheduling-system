import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingDialogComponent } from './teaching-dialog.component';

describe('TeachingDialogComponent', () => {
  let component: TeachingDialogComponent;
  let fixture: ComponentFixture<TeachingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeachingDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
