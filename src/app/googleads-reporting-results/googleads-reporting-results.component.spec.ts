import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleadsReportingResultsComponent } from './googleads-reporting-results.component';

describe('GoogleadsReportingResultsComponent', () => {
  let component: GoogleadsReportingResultsComponent;
  let fixture: ComponentFixture<GoogleadsReportingResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleadsReportingResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleadsReportingResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
