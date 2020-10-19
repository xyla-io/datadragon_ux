import { TestBed, inject } from '@angular/core/testing';

import { CheshireItunesconnectService } from './cheshire-itunesconnect.service';

describe('CheshireItunesconnectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheshireItunesconnectService]
    });
  });

  it('should be created', inject([CheshireItunesconnectService], (service: CheshireItunesconnectService) => {
    expect(service).toBeTruthy();
  }));
});
