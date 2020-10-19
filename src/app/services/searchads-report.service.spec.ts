import { TestBed, inject } from '@angular/core/testing';

import { SearchadsReportService } from './searchads-report.service';

describe('SearchadsReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchadsReportService]
    });
  });

  it('should be created', inject([SearchadsReportService], (service: SearchadsReportService) => {
    expect(service).toBeTruthy();
  }));
});
