import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdjustCredentialComponent } from './edit-adjust-credential.component';

describe('EditAdjustCredentialComponent', () => {
  let component: EditAdjustCredentialComponent;
  let fixture: ComponentFixture<EditAdjustCredentialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAdjustCredentialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAdjustCredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
