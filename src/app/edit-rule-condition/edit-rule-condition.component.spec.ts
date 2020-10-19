import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRuleConditionComponent } from './edit-rule-condition.component';

describe('EditRuleConditionComponent', () => {
  let component: EditRuleConditionComponent;
  let fixture: ComponentFixture<EditRuleConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRuleConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRuleConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
