import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickInfoHeaderComponent } from './quick-info-header.component';

describe('QuickInfoHeaderComponent', () => {
  let component: QuickInfoHeaderComponent;
  let fixture: ComponentFixture<QuickInfoHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickInfoHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickInfoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
