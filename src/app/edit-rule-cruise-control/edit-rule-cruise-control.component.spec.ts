import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRuleCruiseControlComponent } from './edit-rule-cruise-control.component';

describe('EditRuleCruiseControlComponent', () => {
  let component: EditRuleCruiseControlComponent;
  let fixture: ComponentFixture<EditRuleCruiseControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRuleCruiseControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRuleCruiseControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
