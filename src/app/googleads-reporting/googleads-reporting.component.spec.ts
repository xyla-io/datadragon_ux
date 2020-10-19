import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleadsReportingComponent } from './googleads-reporting.component';

describe('GoogleadsReportingComponent', () => {
  let component: GoogleadsReportingComponent;
  let fixture: ComponentFixture<GoogleadsReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleadsReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleadsReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
