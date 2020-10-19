import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterableDropdownComponent } from './filterable-dropdown.component';

describe('FilterableDropdownComponent', () => {
  let component: FilterableDropdownComponent;
  let fixture: ComponentFixture<FilterableDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterableDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterableDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
