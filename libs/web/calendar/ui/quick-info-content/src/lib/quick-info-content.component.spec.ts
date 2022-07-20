import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickInfoContentComponent } from './quick-info-content.component';

describe('QuickInfoContentComponent', () => {
  let component: QuickInfoContentComponent;
  let fixture: ComponentFixture<QuickInfoContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickInfoContentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickInfoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
