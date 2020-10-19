import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSnapchatCredentialComponent } from './edit-snapchat-credential.component';

describe('EditSnapchatCredentialComponent', () => {
  let component: EditSnapchatCredentialComponent;
  let fixture: ComponentFixture<EditSnapchatCredentialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSnapchatCredentialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSnapchatCredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
