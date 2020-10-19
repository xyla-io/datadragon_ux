import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdjustRevenueComponent } from './edit-adjust-revenue.component';

describe('EditAdjustRevenueComponent', () => {
  let component: EditAdjustRevenueComponent;
  let fixture: ComponentFixture<EditAdjustRevenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAdjustRevenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAdjustRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
