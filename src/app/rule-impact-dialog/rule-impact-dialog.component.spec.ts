import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleImpactDialogComponent } from './rule-impact-dialog.component';

describe('RuleImpactDialogComponent', () => {
  let component: RuleImpactDialogComponent;
  let fixture: ComponentFixture<RuleImpactDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleImpactDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleImpactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
