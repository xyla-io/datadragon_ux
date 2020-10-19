import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapchatCredentialsListComponent } from './snapchat-credentials-list.component';

describe('SnapchatCredentialsListComponent', () => {
  let component: SnapchatCredentialsListComponent;
  let fixture: ComponentFixture<SnapchatCredentialsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnapchatCredentialsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapchatCredentialsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
