import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapchatCredentialsComponent } from './snapchat-credentials.component';

describe('SnapchatCredentialsComponent', () => {
  let component: SnapchatCredentialsComponent;
  let fixture: ComponentFixture<SnapchatCredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnapchatCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapchatCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
