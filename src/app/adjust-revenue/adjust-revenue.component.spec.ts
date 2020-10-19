import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustRevenueComponent } from './adjust-revenue.component';

describe('AdjustRevenueComponent', () => {
  let component: AdjustRevenueComponent;
  let fixture: ComponentFixture<AdjustRevenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustRevenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
