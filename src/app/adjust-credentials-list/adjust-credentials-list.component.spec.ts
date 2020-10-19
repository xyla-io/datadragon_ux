import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustCredentialsListComponent } from './adjust-credentials-list.component';

describe('AdjustCredentialsListComponent', () => {
  let component: AdjustCredentialsListComponent;
  let fixture: ComponentFixture<AdjustCredentialsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustCredentialsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustCredentialsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
