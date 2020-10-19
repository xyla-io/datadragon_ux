import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustCredentialsComponent } from './adjust-credentials.component';

describe('AdjustCredentialsComponent', () => {
  let component: AdjustCredentialsComponent;
  let fixture: ComponentFixture<AdjustCredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
