import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheshireItunesconnectAnalyticsComponent } from './cheshire-itunesconnect-analytics.component';

describe('CheshireItunesconnectAnalyticsComponent', () => {
  let component: CheshireItunesconnectAnalyticsComponent;
  let fixture: ComponentFixture<CheshireItunesconnectAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheshireItunesconnectAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheshireItunesconnectAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
