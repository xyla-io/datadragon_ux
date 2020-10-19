import { TestBed, inject } from '@angular/core/testing';

import { ApiErrorService } from './api-error.service';

describe('ApiErrorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiErrorService]
    });
  });

  it('should be created', inject([ApiErrorService], (service: ApiErrorService) => {
    expect(service).toBeTruthy();
  }));
});
