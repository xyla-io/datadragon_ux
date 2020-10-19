import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSearchadsReportingComponent } from './edit-searchads-reporting.component';

describe('EditSearchadsReportingComponent', () => {
  let component: EditSearchadsReportingComponent;
  let fixture: ComponentFixture<EditSearchadsReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSearchadsReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSearchadsReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
