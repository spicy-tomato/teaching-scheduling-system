import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickInfoContentCellComponent } from './quick-info-content-cell.component';

describe('QuickInfoContentCellComponent', () => {
  let component: QuickInfoContentCellComponent;
  let fixture: ComponentFixture<QuickInfoContentCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickInfoContentCellComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickInfoContentCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
