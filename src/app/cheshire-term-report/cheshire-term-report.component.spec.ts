import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheshireTermReportComponent } from './cheshire-term-report.component';

describe('CheshireTermReportComponent', () => {
  let component: CheshireTermReportComponent;
  let fixture: ComponentFixture<CheshireTermReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheshireTermReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheshireTermReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
