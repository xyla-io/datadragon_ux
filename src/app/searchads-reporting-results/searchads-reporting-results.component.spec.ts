import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchadsReportingResultsComponent } from './searchads-reporting-results.component';

describe('SearchadsReportingResultsComponent', () => {
  let component: SearchadsReportingResultsComponent;
  let fixture: ComponentFixture<SearchadsReportingResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchadsReportingResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchadsReportingResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
