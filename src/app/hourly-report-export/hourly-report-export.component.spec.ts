import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyReportExportComponent } from './hourly-report-export.component';

describe('HourlyReportExportComponent', () => {
  let component: HourlyReportExportComponent;
  let fixture: ComponentFixture<HourlyReportExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HourlyReportExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourlyReportExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
