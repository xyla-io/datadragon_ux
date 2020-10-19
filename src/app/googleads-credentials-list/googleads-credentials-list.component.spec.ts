import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleadsCredentialsListComponent } from './googleads-credentials-list.component';

describe('GoogleadsCredentialsListComponent', () => {
  let component: GoogleadsCredentialsListComponent;
  let fixture: ComponentFixture<GoogleadsCredentialsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleadsCredentialsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleadsCredentialsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
