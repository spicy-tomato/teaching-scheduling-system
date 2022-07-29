import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebConfigComponent } from './web-config.component';

describe('WebConfigComponent', () => {
  let component: WebConfigComponent;
  let fixture: ComponentFixture<WebConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebConfigComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
