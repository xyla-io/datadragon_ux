import { TestBed, inject } from '@angular/core/testing';

import { CsvDownloaderService } from './csv-downloader.service';

describe('CsvDownloaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CsvDownloaderService]
    });
  });

  it('should be created', inject([CsvDownloaderService], (service: CsvDownloaderService) => {
    expect(service).toBeTruthy();
  }));
});
