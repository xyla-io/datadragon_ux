import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleadsCredentialsComponent } from './googleads-credentials.component';

describe('GoogleadsCredentialsComponent', () => {
  let component: GoogleadsCredentialsComponent;
  let fixture: ComponentFixture<GoogleadsCredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleadsCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleadsCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
