import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleImpactComponent } from './rule-impact.component';

describe('RuleImpactComponent', () => {
  let component: RuleImpactComponent;
  let fixture: ComponentFixture<RuleImpactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleImpactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
