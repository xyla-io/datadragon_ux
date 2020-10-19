import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCheshireTermComponent } from './edit-cheshire-term.component';

describe('EditCheshireTermComponent', () => {
  let component: EditCheshireTermComponent;
  let fixture: ComponentFixture<EditCheshireTermComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCheshireTermComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCheshireTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
