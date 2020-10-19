import { TestBed, inject } from '@angular/core/testing';

import { AdgroupService } from './adgroup.service';

describe('AdgroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdgroupService]
    });
  });

  it('should be created', inject([AdgroupService], (service: AdgroupService) => {
    expect(service).toBeTruthy();
  }));
});
