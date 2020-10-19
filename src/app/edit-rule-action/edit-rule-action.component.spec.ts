import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRuleActionComponent } from './edit-rule-action.component';

describe('EditRuleActionComponent', () => {
  let component: EditRuleActionComponent;
  let fixture: ComponentFixture<EditRuleActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRuleActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRuleActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
