import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCheshireItunesconnectAnalyticsComponent } from './edit-cheshire-itunesconnect-analytics.component';

describe('EditCheshireItunesconnectAnalyticsComponent', () => {
  let component: EditCheshireItunesconnectAnalyticsComponent;
  let fixture: ComponentFixture<EditCheshireItunesconnectAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCheshireItunesconnectAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCheshireItunesconnectAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
