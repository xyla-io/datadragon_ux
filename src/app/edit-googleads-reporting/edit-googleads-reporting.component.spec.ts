import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGoogleadsReportingComponent } from './edit-googleads-reporting.component';

describe('EditGoogleadsReportingComponent', () => {
  let component: EditGoogleadsReportingComponent;
  let fixture: ComponentFixture<EditGoogleadsReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGoogleadsReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGoogleadsReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
