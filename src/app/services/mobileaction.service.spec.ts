import { TestBed, inject } from '@angular/core/testing';

import { MobileactionService } from './mobileaction.service';

describe('MobileactionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MobileactionService]
    });
  });

  it('should be created', inject([MobileactionService], (service: MobileactionService) => {
    expect(service).toBeTruthy();
  }));
});
