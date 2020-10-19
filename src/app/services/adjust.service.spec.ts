import { TestBed, inject } from '@angular/core/testing';

import { AdjustService } from './adjust.service';

describe('AdjustService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdjustService]
    });
  });

  it('should be created', inject([AdjustService], (service: AdjustService) => {
    expect(service).toBeTruthy();
  }));
});
