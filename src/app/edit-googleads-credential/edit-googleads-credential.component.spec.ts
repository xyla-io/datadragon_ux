import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGoogleadsCredentialComponent } from './edit-googleads-credential.component';

describe('EditGoogleadsCredentialComponent', () => {
  let component: EditGoogleadsCredentialComponent;
  let fixture: ComponentFixture<EditGoogleadsCredentialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGoogleadsCredentialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGoogleadsCredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
