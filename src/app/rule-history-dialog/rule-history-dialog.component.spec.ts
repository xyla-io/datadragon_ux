import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleHistoryDialogComponent } from './rule-history-dialog.component';

describe('RuleHistoryDialogComponent', () => {
  let component: RuleHistoryDialogComponent;
  let fixture: ComponentFixture<RuleHistoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleHistoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
