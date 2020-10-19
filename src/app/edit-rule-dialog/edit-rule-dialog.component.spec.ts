import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRuleDialogComponent } from './edit-rule-dialog.component';

describe('EditRuleDialogComponent', () => {
  let component: EditRuleDialogComponent;
  let fixture: ComponentFixture<EditRuleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRuleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRuleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
