import { TestBed, inject } from '@angular/core/testing';

import { GoogleadsService } from './googleads.service';

describe('GoogleadsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleadsService]
    });
  });

  it('should be created', inject([GoogleadsService], (service: GoogleadsService) => {
    expect(service).toBeTruthy();
  }));
});
