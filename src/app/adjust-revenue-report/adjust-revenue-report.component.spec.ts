import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustRevenueReportComponent } from './adjust-revenue-report.component';

describe('AdjustRevenueReportComponent', () => {
  let component: AdjustRevenueReportComponent;
  let fixture: ComponentFixture<AdjustRevenueReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustRevenueReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustRevenueReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
