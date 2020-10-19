import { TestBed, inject } from '@angular/core/testing';

import { RuleHistoryService } from './rule-history.service';

describe('RuleHistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RuleHistoryService]
    });
  });

  it('should be created', inject([RuleHistoryService], (service: RuleHistoryService) => {
    expect(service).toBeTruthy();
  }));
});
