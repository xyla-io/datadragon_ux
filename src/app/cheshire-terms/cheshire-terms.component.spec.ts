import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheshireTermsComponent } from './cheshire-terms.component';

describe('CheshireTermsComponent', () => {
  let component: CheshireTermsComponent;
  let fixture: ComponentFixture<CheshireTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheshireTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheshireTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
