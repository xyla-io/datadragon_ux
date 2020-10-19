import { TestBed, inject } from '@angular/core/testing';

import { CheshireTermsService } from './cheshire-terms.service';

describe('CheshireTermsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheshireTermsService]
    });
  });

  it('should be created', inject([CheshireTermsService], (service: CheshireTermsService) => {
    expect(service).toBeTruthy();
  }));
});
