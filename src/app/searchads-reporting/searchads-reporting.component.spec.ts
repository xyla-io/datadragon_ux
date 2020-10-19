import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchadsReportingComponent } from './searchads-reporting.component';

describe('SearchadsReportingComponent', () => {
  let component: SearchadsReportingComponent;
  let fixture: ComponentFixture<SearchadsReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchadsReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchadsReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
