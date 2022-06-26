import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingDialogNavigationComponent } from './teaching-dialog-navigation.component';

describe('TeachingDialogNavigationComponent', () => {
  let component: TeachingDialogNavigationComponent;
  let fixture: ComponentFixture<TeachingDialogNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeachingDialogNavigationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachingDialogNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
