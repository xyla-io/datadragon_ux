import { TestBed, inject } from '@angular/core/testing';

import { NewRelicService } from './new-relic.service';

describe('NewRelicService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewRelicService]
    });
  });

  it('should be created', inject([NewRelicService], (service: NewRelicService) => {
    expect(service).toBeTruthy();
  }));
});
